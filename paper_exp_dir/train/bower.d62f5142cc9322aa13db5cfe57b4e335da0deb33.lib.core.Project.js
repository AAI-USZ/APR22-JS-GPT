var glob = require('glob');
var path = require('path');
var fs = require('graceful-fs');
var Q = require('q');
var semver = require('semver');
var mout = require('mout');
var rimraf = require('rimraf');
var promptly = require('promptly');
var endpointParser = require('bower-endpoint-parser');
var Logger = require('bower-logger');
var Manager = require('./Manager');
var defaultConfig = require('../config');
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
if (node.missing) {
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


if (endpoints) {
endpoints.forEach(function (endpoint) {
var decEndpoint = endpointParser.decompose(endpoint);
targets.push(decEndpoint);




decEndpoint.newly = true;
});
}


return that._bootstrap(targets, resolved, incompatibles);
})
.then(function (installed) {

if (that._options.save || that._options.saveDev) {
mout.object.forOwn(targets, function (decEndpoint) {
var jsonEndpoint = endpointParser.decomposed2json(decEndpoint);

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
targets.push(node);
return false;
}, true);


mout.object.forOwn(flattened, function (decEndpoint) {
if (decEndpoint.extraneous && !decEndpoint.linked) {
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
if (decEndpoint.extraneous && !decEndpoint.linked && names.indexOf(name) !== -1) {
targets.push(decEndpoint);
}
});



that.walkTree(tree, function (node, name) {
if (node.missing) {
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

tree = this._manager.toData(tree, ['missing', 'incompatible', 'linked']);


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
extraneous.push(this._manager.toData(pkg, ['missing', 'incompatible', 'linked']));
}
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
this._logger.warn('no-json', 'No bower.json file to save to');
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

if (!this._options.production) {
this._restoreNode(root, flattened, 'devDependencies');
}


mout.object.forOwn(flattened, function (decEndpoint) {
if (!decEndpoint.dependants) {
decEndpoint.extraneous = true;


this._restoreNode(decEndpoint, flattened, 'dependencies');
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
name: path.basename(this._config.cwd) || 'root'
})
.spread(function (json, deprecated) {
var jsonStr;

that._jsonFile = path.join(that._config.cwd, deprecated ? deprecated : 'bower.json');

if (deprecated) {
that._logger.warn('deprecated', 'You are using the deprecated ' + deprecated + ' file');
}

jsonStr = JSON.stringify(json, null, '  ') + '\n';
that._jsonHash = md5(jsonStr);
return that._json = json;
});
