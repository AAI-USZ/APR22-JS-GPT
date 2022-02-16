var glob = require('glob');
var path = require('path');
var fs = require('graceful-fs');
var Q = require('q');
var semver = require('semver');
var mout = require('mout');
var rimraf = require('rimraf');
var promptly = require('promptly');
var bowerJson = require('bower-json');
var Manager = require('./Manager');
var Logger = require('./Logger');
var defaultConfig = require('../config');
var md5 = require('../util/md5');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');

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

