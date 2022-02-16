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


return that._bootstrap(targets, resolved, installed)

.then(function () {
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
.progress(function (notification) {
return notification;
});
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
