var Q = require('q');
var mout = require('mout');
var semver = require('semver');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var PackageRepository = require('./PackageRepository');
var defaultConfig = require('../config');
var copy = require('../util/copy');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');

var Manager = function (options) {
options = options || {};

this._config = options.config || defaultConfig;
this._repository = new PackageRepository(options);
};

Manager.prototype.configure = function (unresolved, resolved) {

if (this._working) {
throw createError('Can\'t configure while working', 'EWORKING');
}


this._targets = unresolved;
this._resolved = {};

mout.object.forOwn(resolved, function (decEndpoint) {

if (!decEndpoint.name || !decEndpoint.dir || !decEndpoint.json) {
throw createError('The properties "name", "dir" and "json" must be set when configuring resolved endpoints');
}

this._resolved[decEndpoint.name] = [decEndpoint];
decEndpoint.initial = true;
}, this);

return this;
};

Manager.prototype.resolve = function () {

if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}
