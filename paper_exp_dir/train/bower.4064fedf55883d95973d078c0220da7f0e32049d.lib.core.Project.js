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
});
})
.fin(function () {
that._working = false;
