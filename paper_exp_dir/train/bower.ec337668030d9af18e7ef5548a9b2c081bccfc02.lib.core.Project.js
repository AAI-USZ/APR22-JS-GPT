var glob = require('glob');
var path = require('path');
var fs = require('graceful-fs');
var Q = require('q');
var semver = require('semver');
var mout = require('mout');
var rimraf = require('rimraf');
var promptly = require('promptly');
var bowerJson = require('bower-json');
var endpointParser = require('bower-endpoint-parser');
var Manager = require('./Manager');
var Logger = require('./Logger');
var defaultConfig = require('../config');
var md5 = require('../util/md5');
var createError = require('../util/createError');

function Project(config, logger) {




this._config = config || defaultConfig;
this._logger = logger || new Logger();
this._manager = new Manager(this._config, this._logger);
}



Project.prototype.install = function (endpoints, options) {
var that = this;
var targets = [];
var resolved = {};
var incompatibles = [];


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

options = options || {};
this._production = !!options.production;
this._working = true;


return this._analyse()
.spread(function (json, tree) {

that.walkTree(tree, function (node, name) {
if (node.missing || node.linked) {
targets.push(node);
} else if (node.incompatible) {
incompatibles.push(node);
} else {
resolved[name] = node;
}
}, true);


if (endpoints) {
endpoints.forEach(function (endpoint) {
var decEndpoint = endpointParser.decompose(endpoint);
targets.push(decEndpoint);


decEndpoint.unresolvable = true;
});
}


return that._bootstrap(targets, resolved, incompatibles);
})
.then(function (installed) {

if (options.save || options.saveDev) {
mout.object.forOwn(targets, function (decEndpoint) {
var jsonEndpoint = endpointParser.decomposed2json(decEndpoint);

if (options.save) {
that._json.dependencies = mout.object.mixIn(that._json.dependencies || {}, jsonEndpoint);
}

if (options.saveDev) {
that._json.devDependencies = mout.object.mixIn(that._json.devDependencies || {}, jsonEndpoint);
}
});
}


return that._saveJson()
.then(function () {
return installed;
});
})
.fin(function () {
that._installed = null;
that._working = false;
});
};

Project.prototype.update = function (names, options) {
var that = this;
var targets = [];
var resolved = {};
var incompatibles = [];


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

options = options || {};
this._production = !!options.production;
this._working = true;


return this._analyse()
.spread(function (json, tree, flattened) {

if (!names) {

that.walkTree(tree, function (node) {
targets.push(node);
return false;
}, true);


mout.object.forOwn(flattened, function (decEndpoint) {
if (decEndpoint.extraneous) {
targets.push(decEndpoint);
}
});

} else {


names.forEach(function (name) {
if (!flattened[name]) {
throw createError('Package ' + name + ' is not installed', 'ENOTINS', {
name: name
});
}
});


that.walkTree(tree, function (node, name) {
if (names.indexOf(name) !== -1) {
targets.push(node);
return false;
}
}, true);


mout.object.forOwn(flattened, function (decEndpoint, name) {
if (decEndpoint.extraneous && names.indexOf(name) !== -1) {
targets.push(decEndpoint);
}
});



that.walkTree(tree, function (node, name) {
if (node.missing || node.linked) {
targets.push(node);
} else if (node.incompatible) {
incompatibles.push(node);
} else {
resolved[name] = node;
}
}, true);
}


return that._bootstrap(targets, resolved, incompatibles)
.then(function (installed) {

return that._saveJson()
.then(function () {
return installed;
});
});
})
.fin(function () {
that._installed = null;
that._working = false;
});
};

Project.prototype.uninstall = function (names, options) {
var that = this;
var packages = {};


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

options = options || {};
this._working = true;


return this._analyse()

.spread(function (json, tree, flattened) {
var promise = Q.resolve();

names.forEach(function (name) {
var decEndpoint = flattened[name];


if (!decEndpoint || decEndpoint.missing) {
packages[name] = null;
return;
}

promise = promise
.then(function () {
var message;
var data;
var dependantsNames;
var dependants = [];


that.walkTree(tree, function (node, nodeName) {
if (name === nodeName) {
dependants.push.apply(dependants, mout.object.values(node.dependants));
}
}, true);


dependants = mout.array.unique(dependants);



dependants = dependants.filter(function (dependant) {
return !dependant.root && names.indexOf(dependant.name) === -1;
});



if (!dependants.length || that._config.force) {
packages[name] = decEndpoint.canonicalDir;
return;
}




dependantsNames = dependants
.map(function (dep) {
return dep.name;
})
.sort(function (name1, name2) {
return name1.localeCompare(name2);
});

dependantsNames = mout.array.unique(dependantsNames);
message = dependantsNames.join(', ') + ' depends on ' + decEndpoint.name;
data = {
name: decEndpoint.name,
dependants: dependants
};


if (!that._config.interactive) {
throw createError(message, 'ECONFLICT', {
data: data
});
}

that._logger.conflict('mutual', message, data);


return Q.nfcall(promptly.confirm, 'Continue anyway? (y/n)')
.then(function (confirmed) {


if (!confirmed) {
mout.array.remove(names, name);
} else {
packages[name] = decEndpoint.canonicalDir;
}
});
});
});

return promise;
})

.then(function () {
return that._removePackages(packages, options);
})
.fin(function () {
that._installed = null;
that._working = false;
});
};

Project.prototype.getTree = function () {
return this._analyse()
.spread(function (json, tree, flattened) {
var extraneous = [];

tree = this._manager.toData(tree, ['missing', 'linked']);


this.walkTree(tree, function (node) {
var version;
var target = node.endpoint.target;

if (node.pkgMeta && semver.validRange(target)) {
version = node.pkgMeta.version;


if (!version && target === '*') {
return;
}

if (!version || !semver.satisfies(version, target)) {
node.incompatible = true;
}
}
}, true);


mout.object.forOwn(flattened, function (pkg) {
if (pkg.extraneous) {
extraneous.push(this._manager.toData(pkg, ['linked']));
}
}, this);

return [tree, flattened, extraneous];
}.bind(this));
};

Project.prototype.getJson = function () {
return this._readJson();
};

Project.prototype.walkTree = function (node, fn, onlyOnce) {
var result;
var dependencies;
var queue = mout.object.values(node.dependencies);

if (onlyOnce === true) {
onlyOnce = [];
}

while (queue.length) {
node = queue.shift();
result = fn(node, node.name);


if (result === false) {
continue;
}


dependencies = mout.object.values(node.dependencies);

if (onlyOnce) {
dependencies = dependencies.filter(function (dependency) {
return !mout.array.find(onlyOnce, function (stacked) {
if (dependency.endpoint) {
return mout.object.equals(dependency.endpoint, stacked.endpoint);
}

return dependency.name === stacked.name &&
dependency.source === stacked.source &&
dependency.target === stacked.target;
});
});

onlyOnce.push.apply(onlyOnce, dependencies);
}

queue.unshift.apply(queue, dependencies);
}
};



Project.prototype._analyse = function () {
return Q.all([
this._readJson(),
this._readInstalled(),
this._readLinks()
])
.spread(function (json, installed, links) {
var root;
var flattened = mout.object.mixIn({}, installed, links);

root = {
name: json.name,
source: this._config.cwd,
target: json.version || '*',
pkgMeta: json,
canonicalDir: this._config.cwd,
root: true
};



this._restoreNode(root, flattened, 'dependencies');

if (!this._production) {
this._restoreNode(root, flattened, 'devDependencies');
}


mout.object.forOwn(flattened, function (decEndpoint) {
var release;

if (!decEndpoint.dependants) {
decEndpoint.extraneous = true;


this._restoreNode(decEndpoint, flattened, 'dependencies');


if (this._jsonFile) {
release = decEndpoint.pkgMeta._release;
this._logger.log('warn', 'extraneous', decEndpoint.name + (release ? '#' + release : ''), this._manager.toData(decEndpoint));
}
}
}, this);


delete flattened[json.name];

return [json, root, flattened];
}.bind(this));
};

Project.prototype._bootstrap = function (targets, resolved, incompatibles) {
var installed = mout.object.map(this._installed, function (decEndpoint) {
return decEndpoint.pkgMeta;
});

this._json.resolutions = this._json.resolutions || {};


return this._manager
.configure({
targets: targets,
resolved: resolved,
incompatibles: incompatibles,
resolutions: this._json.resolutions,
installed: installed
})
.resolve()
.then(function () {

if (!mout.object.size(this._json.resolutions)) {
delete this._json.resolutions;
}
}.bind(this))

.then(this._manager.install.bind(this._manager));
};

Project.prototype._readJson = function () {
var that = this;

if (this._json) {
return Q.resolve(this._json);
}


return this._json = Q.nfcall(bowerJson.find, this._config.cwd)
.then(function (filename) {

if (path.basename(filename) === 'component.json') {
process.nextTick(function () {
that._logger.warn('deprecated', 'You are using the deprecated component.json file', {
json: filename
});
});
}

that._jsonFile = filename;


return Q.nfcall(bowerJson.read, filename)
.fail(function (err) {
throw createError('Something went wrong while reading ' + filename, err.code, {
details: err.message,
data: {
filename: filename
}
});
});
}, function () {

return Q.nfcall(bowerJson.parse, {
name: path.basename(that._config.cwd)
});
})
.then(function (json) {
var jsonStr = JSON.stringify(json, null, '  ');
that._jsonHash = md5(jsonStr);
return that._json = json;
});
};

Project.prototype._saveJson = function () {
var jsonStr = JSON.stringify(this._json, null, '  ');
var jsonHash = md5(jsonStr);


if (jsonHash === this._jsonHash) {
return Q.resolve();
}

if (!this._jsonFile) {
this._logger.warn('no-json', 'No bower.json file to save to');
return Q.resolve();
}

return Q.nfcall(fs.writeFile, this._jsonFile, jsonStr)
.then(function () {
this._jsonHash = jsonHash;
}.bind(this));
};

Project.prototype._readInstalled = function () {
var componentsDir;
var that = this;

if (this._installed) {
return Q.resolve(this._installed);
}



componentsDir = path.join(this._config.cwd, this._config.directory);
return this._installed = Q.nfcall(glob, '*/.bower.json', {
cwd: componentsDir,
dot: true
})
.then(function (filenames) {
var promises;
var decEndpoints = {};


promises = filenames.map(function (filename) {
var name = path.dirname(filename);
var metaFile = path.join(componentsDir, filename);


return Q.nfcall(bowerJson.read, metaFile)
.then(function (pkgMeta) {
decEndpoints[name] = {
name: name,
source: pkgMeta._source,
target: pkgMeta._target,
canonicalDir: path.dirname(metaFile),
pkgMeta: pkgMeta
};

}, function () {});
});



return Q.all(promises)
.then(function () {
return that._installed = decEndpoints;
});
});
};

Project.prototype._readLinks = function () {
var componentsDir;


componentsDir = path.join(this._config.cwd, this._config.directory);
return Q.nfcall(fs.readdir, componentsDir)
.then(function (filenames) {
var promises;
var decEndpoints = {};


promises = filenames.map(function (filename) {
var dir = path.join(componentsDir, filename);

return Q.nfcall(fs.lstat, dir)
.then(function (stat) {
if (stat.isSymbolicLink()) {
decEndpoints[filename] = {
name: filename,
source: dir,
target: '*',
canonicalDir: dir,
pkgMeta: {
name: filename
},
linked: true
};
}
});
});



return Q.all(promises)
.then(function () {
return decEndpoints;
});

}, function (err) {
if (err.code !== 'ENOENT') {
throw err;
}

return {};
});
};

Project.prototype._removePackages = function (packages, options) {
var promises = [];

mout.object.forOwn(packages, function (dir, name) {
var promise;


if (!dir) {
promise = Q.resolve();
this._logger.warn('not-installed', name, {
name: name
});
} else {
promise = Q.nfcall(rimraf, dir);
this._logger.action('uninstall', name, {
name: name,
dir: dir
});
}


if (options.save && this._json.dependencies) {
promise = promise
.then(function () {
delete this._json.dependencies[name];
}.bind(this));
}

if (options.saveDev && this._json.devDependencies) {
promise = promise
.then(function () {
delete this._json.devDependencies[name];
}.bind(this));
}

promises.push(promise);
}, this);

return Q.all(promises)

.then(this._saveJson.bind(this))

.then(function () {
return mout.object.filter(packages, function (dir) {
return !!dir;
});
});
};

Project.prototype._restoreNode = function (node, flattened, jsonKey) {
var deps;


if (node.missing || node.incompatible) {
return;
}

node.dependencies = node.dependencies || {};
node.dependants = node.dependants || {};

deps = mout.object.filter(node.pkgMeta[jsonKey], function (value, key) {
return !node.dependencies[key];
});

mout.object.forOwn(deps, function (value, key) {
var local = flattened[key];
var json = endpointParser.json2decomposed(key, value);
var restored;
var compatible;


if (!local) {
flattened[key] = restored = json;
restored.missing = true;

} else {
compatible = !local.missing && json.target === local.pkgMeta._target;

if (!compatible) {
restored = json;

if (!local.missing) {
restored.pkgMeta = local.pkgMeta;
restored.canonicalDir = local.canonicalDir;
restored.incompatible = true;
} else {
restored.missing = true;
}
} else {
restored = local;
mout.object.mixIn(local, json);
}
}


node.dependencies[key] = restored;
restored.dependants = restored.dependants || {};
restored.dependants[node.name] = node;


this._restoreNode(restored, flattened, 'dependencies');


if (local && restored !== local) {
this._restoreNode(local, flattened, 'dependencies');
}
}, this);
};

module.exports = Project;
