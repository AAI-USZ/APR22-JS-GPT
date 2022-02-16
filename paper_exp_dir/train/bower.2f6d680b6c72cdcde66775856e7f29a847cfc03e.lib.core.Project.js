var glob = require('glob');
var path = require('path');
var fs = require('graceful-fs');
var Q = require('q');
var mout = require('mout');
var rimraf = require('rimraf');
var endpointParser = require('bower-endpoint-parser');
var Logger = require('bower-logger');
var Manager = require('./Manager');
var defaultConfig = require('../config');
var semver = require('../util/semver');
var md5 = require('../util/md5');
var createError = require('../util/createError');
var readJson = require('../util/readJson');
var validLink = require('../util/validLink');
var scripts = require('./scripts');

function Project(config, logger) {




this._config = defaultConfig(config);
this._logger = logger || new Logger();
this._manager = new Manager(this._config, this._logger);

this._options = {};
}



Project.prototype.install = function (decEndpoints, options, config) {
var that = this;
var targets = [];
var resolved = {};
var incompatibles = [];


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

this._options = options || {};
this._config = config || {};
this._working = true;


return this._analyse()
.spread(function (json, tree) {


if(!that._jsonFile && decEndpoints.length === 0 ) {
throw createError('No bower.json present', 'ENOENT');
}


that.walkTree(tree, function (node, name) {
if (node.incompatible) {
incompatibles.push(node);
} else if (node.missing || node.different || that._config.force) {
targets.push(node);
} else {
resolved[name] = node;
}
}, true);


decEndpoints = decEndpoints || [];
decEndpoints.forEach(function (decEndpoint) {




decEndpoint.newly = true;
targets.push(decEndpoint);
});


return that._bootstrap(targets, resolved, incompatibles);
})
.then(function () {
return that._manager.preinstall(that._json);
})
.then(function () {
return that._manager.install(that._json);
})
.then(function (installed) {

if (that._options.save || that._options.saveDev) {

decEndpoints.forEach(function (decEndpoint) {
var jsonEndpoint;

jsonEndpoint = endpointParser.decomposed2json(decEndpoint);

if (that._options.saveExact) {
jsonEndpoint[decEndpoint.name] = decEndpoint.pkgMeta.version;
}

if (that._options.save) {
that._json.dependencies = mout.object.mixIn(that._json.dependencies || {}, jsonEndpoint);
}

if (that._options.saveDev) {
that._json.devDependencies = mout.object.mixIn(that._json.devDependencies || {}, jsonEndpoint);
}
});
}
