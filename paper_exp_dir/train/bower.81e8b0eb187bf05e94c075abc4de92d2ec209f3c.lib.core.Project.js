var glob = require('glob');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var rimraf = require('rimraf');
var promptly = require('promptly');
var bowerJson = require('bower-json');
var Manager = require('./Manager');
var defaultConfig = require('../config');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');
var F = require('../util/flow');

function Project(config) {
this._config = config || defaultConfig;
this._manager = new Manager(this._config);
}



Project.prototype.install = function (endpoints, options) {
var that = this;
var targets = {};
var resolved = {};
var installed;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

options = options || {};
this._production = !!options.production;



if (!endpoints) {
return this._repair(true)
.fin(function () {
that._working = false;
});
}


return this._repair()

.then(that.analyse.bind(this))
.spread(function (json, tree, flattened) {
var targets = {};
var resolved = {};
var installed;


endpoints.forEach(function (endpoint) {
var decEndpoint = endpointParser.decompose(endpoint);
targets[decEndpoint.name] = decEndpoint;
});





that._walkTree(tree, function (node, name) {
if (targets[name]) {
return false;
}
resolved[name] = node.pkgMeta;
});

installed = mout.object.map(flattened, function (decEndpoint) {
return decEndpoint.pkgMeta;
});
})

.then(function () {
return that._bootstrap(targets, resolved, installed);
})

.then(function (installed) {
var jsonKey;

if (!options.save && !options.saveDev) {
return;
}

jsonKey = options.save ? 'dependencies' : 'devDependencies';
that._json[jsonKey] = that._json[jsonKey] || {};

mout.object.forOwn(targets, function (decEndpoint) {
var source = decEndpoint.registry ? '' : decEndpoint.source;
var target = decEndpoint.pkgMeta.version ? '~' + decEndpoint.pkgMeta.version : decEndpoint.target;
that._json[jsonKey][decEndpoint.name] = mout.string.ltrim(source + '#' + target, ['#']);
});

return that._saveJson()
.then(function () {
return installed;
}, null, function (notification) {
return notification;
});
})
.fin(function () {
that._working = false;
});
};

Project.prototype.update = function (names, options) {
var that = this;
var targets;
var resolved;
var installed;
var repaired;
var promise;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

options = options || {};
this._production = !!options.production;


if (!names) {

promise = this.analyse()
.spread(function (json, tree, flattened) {

targets = mout.object.map(json.dependencies, function (value, key) {
return endpointParser.json2decomposed(key, value);
});


installed = mout.object.map(flattened, function (decEndpoint) {
return decEndpoint.pkgMeta;
});
});

} else {


promise = this._repair(true)

.then(function (result) {
repaired = result;
return that.analyse();
})
.spread(function (json, tree, flattened) {
targets = {};
resolved = {};


names.forEach(function (name) {
var decEndpoint = flattened[name];
var jsonEntry;

if (!decEndpoint) {
throw createError('Package ' + name + ' is not installed', 'ENOTINSTALLED');
}


if (repaired[name]) {
return;
}



jsonEntry = json.dependencies && json.dependencies[name];
if (jsonEntry) {
targets[name] = endpointParser.json2decomposed(name, jsonEntry);
} else {
targets[name] = decEndpoint;
}
});



that._walkTree(tree, function (node, name) {
if (targets[name]) {
return false;
}
resolved[name] = node.pkgMeta;
});


installed = mout.object.map(flattened, function (decEndpoint) {
return decEndpoint.pkgMeta;
});
});
}


return promise.then(function () {
return that._bootstrap(targets, resolved, installed);
})
.fin(function () {
that._working = false;
});
};

Project.prototype.uninstall = function (names, options) {
var that = this;
var deferred = Q.defer();
var packages = {};


this.analyse()

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
var dependants;
var message;
var data;




dependants = [];
mout.object.forOwn(decEndpoint.dependants, function (decEndpoint) {
if (!decEndpoint.root && names.indexOf(decEndpoint.name) === -1) {
dependants.push(decEndpoint);
}
});



if (!dependants.length || that._config.force) {
packages[name] = decEndpoint.dir;


} else {
message = dependants.map(function (dep) { return dep.name; }).join(', ') + ' depends on ' + decEndpoint.name;
data = {
package: decEndpoint.name,
dependants: dependants.map(function (decEndpoint) {
return decEndpoint.name;
})
};


if (!that._config.interactive) {
throw createError(message, 'ECONFLICT', {
skippable: true,
data: data
});

} else {
deferred.notify({
level: 'conflict',
id: 'mutual',
message: message,
data: data
});

return Q.nfcall(promptly.confirm, 'Continue anyway? (y/n)')
.then(function (confirmed) {


if (!confirmed) {
mout.array.remove(names, name);
} else {
packages[name] = decEndpoint.dir;
}
});
}
}
});
});

return promise;
})

.then(function () {
return that._removePackages(packages, options)
.progress(function (notification) {
return notification;
});
})
.then(deferred.resolve, deferred.reject, deferred.notify);

return deferred.promise;
};

Project.prototype.analyse = function () {
return F.all([
this._readJson(),
this._readInstalled()
])
.spread(function (json, installed) {
var root;
var flattened = installed;

root = {
name: json.name,
source: this._config.cwd,
target: json.version,
dir: this._config.cwd,
pkgMeta: json,
root: true
};



this._restoreNode(root, flattened);

if (!this._production) {
this._restoreNode(root, flattened, 'devDependencies');
}


mout.object.forOwn(flattened, function (decEndpoint) {
if (!decEndpoint.dependants) {
decEndpoint.extraneous = true;


this._restoreNode(decEndpoint, flattened);

if (!this._production) {
this._restoreNode(decEndpoint, flattened, 'devDependencies');
}
}
}, this);
