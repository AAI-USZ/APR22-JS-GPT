var glob = require('glob');
var path = require('path');
var fs = require('graceful-fs');
var Q = require('q');
var mout = require('mout');
var rimraf = require('rimraf');
var promptly = require('promptly');
var endpointParser = require('bower-endpoint-parser');
var Logger = require('bower-logger');
var Manager = require('./Manager');
var defaultConfig = require('../config');
var semver = require('../util/semver');
var md5 = require('../util/md5');
var createError = require('../util/createError');
var readJson = require('../util/readJson');
var validLink = require('../util/validLink');

function Project(config, logger) {




this._config = config || defaultConfig;
this._logger = logger || new Logger();
this._manager = new Manager(this._config, this._logger);

this._options = {};
}



Project.prototype.install = function (endpoints, options) {
var decEndpoints;
var that = this;
var targets = [];
var resolved = {};
var incompatibles = [];


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

this._options = options || {};
this._working = true;


return this._analyse()
.spread(function (json, tree) {

that.walkTree(tree, function (node, name) {
if (node.missing || node.different) {
targets.push(node);
} else if (node.incompatible) {
incompatibles.push(node);
} else {
resolved[name] = node;
}



if (node.linked) {
return false;
}
});


if (endpoints) {
decEndpoints = endpoints.map(function (endpoint) {
var decEndpoint = endpointParser.decompose(endpoint);





decEndpoint.newly = true;
targets.push(decEndpoint);

return decEndpoint;
});
} else {
decEndpoints = [];
}


return that._bootstrap(targets, resolved, incompatibles);
})
.then(function (installed) {

if (that._options.save || that._options.saveDev) {

decEndpoints.forEach(function (decEndpoint) {
var jsonEndpoint;

jsonEndpoint = endpointParser.decomposed2json(decEndpoint);

if (that._options.save) {
that._json.dependencies = mout.object.mixIn(that._json.dependencies || {}, jsonEndpoint);
}

if (that._options.saveDev) {
that._json.devDependencies = mout.object.mixIn(that._json.devDependencies || {}, jsonEndpoint);
}
});
}


return that.saveJson()
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

this._options = options || {};
this._working = true;


return this._analyse()
.spread(function (json, tree, flattened) {

if (!names) {

that.walkTree(tree, function (node) {


if (node.extraneous && node.linked) {
return false;
}

targets.push(node);
return false;
}, true);

} else {


names.forEach(function (name) {
if (!flattened[name]) {
throw createError('Package ' + name + ' is not installed', 'ENOTINS', {
name: name
});
}
});


that.walkTree(tree, function (node, name) {


if (node.extraneous && node.linked) {
return false;
}

if (names.indexOf(name) !== -1) {
targets.push(node);
return false;
}
}, true);


that.walkTree(tree, function (node, name) {
if (node.missing || node.different) {
targets.push(node);
} else if (node.incompatible) {
incompatibles.push(node);
} else {
resolved[name] = node;
}



if (node.linked) {
return false;
}
}, true);
}


return that._bootstrap(targets, resolved, incompatibles)
.then(function (installed) {

return that.saveJson()
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

this._options = options || {};
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
return that._removePackages(packages);
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
var additionalKeys = ['missing', 'extraneous', 'different', 'linked'];


tree = this._manager.toData(tree, additionalKeys);


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
extraneous.push(this._manager.toData(pkg, additionalKeys));
}
}, this);


flattened = mout.object.map(flattened, function (node) {
return this._manager.toData(node, additionalKeys);
}, this);

return [tree, flattened, extraneous];
}.bind(this));
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

Project.prototype.saveJson = function (forceCreate) {
var file;
var jsonStr = JSON.stringify(this._json, null, '  ') + '\n';
var jsonHash = md5(jsonStr);


if (jsonHash === this._jsonHash) {
return Q.resolve();
}



if (!this._jsonFile && !forceCreate) {
this._logger.warn('no-json', 'No bower.json file to save to, use bower init to create one');
return Q.resolve();
}

file = this._jsonFile || path.join(this._config.cwd, 'bower.json');
return Q.nfcall(fs.writeFile, file, jsonStr)
.then(function () {
this._jsonHash = jsonHash;
this._jsonFile = file;
return this._json;
}.bind(this));
};

Project.prototype.hasJson = function () {
return this._readJson()
.then(function (json) {
return json ? this._jsonFile : false;
}.bind(this));
};

Project.prototype.getJson = function () {
return this._readJson();
};

Project.prototype.getManager = function () {
return this._manager;
};

Project.prototype.getPackageRepository = function () {
return this._manager.getPackageRepository();
};



Project.prototype._analyse = function () {
return Q.all([
this._readJson(),
this._readInstalled(),
this._readLinks()
])
.spread(function (json, installed, links) {
var root;
var jsonCopy = mout.lang.deepClone(json);
var flattened = mout.object.mixIn({}, installed, links);

root = {
name: json.name,
source: this._config.cwd,
target: json.version || '*',
pkgMeta: jsonCopy,
canonicalDir: this._config.cwd,
root: true
};



jsonCopy.dependencies = jsonCopy.dependencies || {};
mout.object.forOwn(installed, function (decEndpoint, key) {
var pkgMeta = decEndpoint.pkgMeta;


if (!jsonCopy.dependencies[key] && pkgMeta._direct) {
decEndpoint.extraneous = true;
jsonCopy.dependencies[key] = (pkgMeta._originalSource || pkgMeta._source) + '#' + pkgMeta._target;
}
});



this._restoreNode(root, flattened, 'dependencies');

if (!this._options.production) {
this._restoreNode(root, flattened, 'devDependencies');
}


mout.object.forOwn(flattened, function (decEndpoint, name) {
if (!decEndpoint.dependants) {
decEndpoint.extraneous = true;
this._restoreNode(decEndpoint, flattened, 'dependencies');

root.dependencies[name] = decEndpoint;
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
installed: installed,
forceLatest: this._options.forceLatest
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


return this._json = readJson(this._config.cwd, {
assume: { name: path.basename(this._config.cwd) || 'root' }
})
.spread(function (json, deprecated, assumed) {
var jsonStr;

if (deprecated) {
that._logger.warn('deprecated', 'You are using the deprecated ' + deprecated + ' file');
}

if (!assumed) {
that._jsonFile = path.join(that._config.cwd, deprecated ? deprecated : 'bower.json');
}

jsonStr = JSON.stringify(json, null, '  ') + '\n';
that._jsonHash = md5(jsonStr);
return that._json = json;
});
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


return readJson(metaFile)
.spread(function (pkgMeta) {
decEndpoints[name] = {
name: name,
source: pkgMeta._originalSource || pkgMeta._source,
target: pkgMeta._target,
canonicalDir: path.dirname(metaFile),
pkgMeta: pkgMeta
};
});
});



return Q.all(promises)
.then(function () {
return that._installed = decEndpoints;
});
});
};

Project.prototype._readLinks = function () {
var componentsDir;
var that = this;


componentsDir = path.join(this._config.cwd, this._config.directory);
return Q.nfcall(fs.readdir, componentsDir)
.then(function (filenames) {
var promises;
var decEndpoints = {};

promises = filenames.map(function (filename) {
var dir = path.join(componentsDir, filename);


return validLink(dir)
.spread(function (valid, err) {
var name;

if (!valid) {
if (err) {
that._logger.debug('read-link', 'Link ' + dir + ' is invalid', {
filename: dir,
error: err
});
}
return;
}

name = path.basename(dir);
return readJson(dir, {
assume: { name: name }
})
.spread(function (json, deprecated) {
if (deprecated) {
that._logger.warn('deprecated', 'Package ' + name + ' is using the deprecated ' + deprecated);
}

json._direct = true;
