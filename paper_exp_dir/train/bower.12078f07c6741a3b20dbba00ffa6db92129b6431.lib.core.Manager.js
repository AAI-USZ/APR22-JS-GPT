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
var F = require('../util/flow');

function Manager(config) {
this._config = config || defaultConfig;
this._repository = new PackageRepository(config);
}



Manager.prototype.configure = function (targets, resolved, installed) {

if (this._working) {
throw createError('Can\'t configure while working', 'EWORKING');
}

this._targets = {};
this._resolved = {};
this._installed = {};


targets.forEach(function (decEndpoint) {
this._targets[decEndpoint.name] = decEndpoint;
}, this);


mout.object.forOwn(resolved, function (value, name) {


this._resolved[name] = [{
name: name,
source: value._source,
target: value.version || '*',
pkgMeta: value,
initial: true
}];

this._installed[name] = value;
}, this);


mout.object.mixIn(this._installed, installed);

return this;
};

Manager.prototype.resolve = function () {

if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}


this._fetching = {};
this._nrFetching = 0;
this._failed = {};
this._failFast = false;
this._deferred = Q.defer();


if (mout.lang.isEmpty(this._targets)) {
process.nextTick(this._dissect.bind(this));


} else {
mout.object.forOwn(this._targets, this._fetch.bind(this));
}


