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



Manager.prototype.configure = function (targets, installed) {

if (this._working) {
throw createError('Can\'t configure while working', 'EWORKING');
}

this._targets = {};
this._resolved = {};


targets.forEach(function (decEndpoint) {
this._targets[decEndpoint.name] = decEndpoint;
}, this);


mout.object.forOwn(installed, function (value, name) {


this._resolved[name] = [{
name: name,
source: null,
target: value.version || '*',
pkgMeta: value,
installed: true
}];
}, this);

return this;
};

Manager.prototype.resolve = function () {

if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}


this._fetching = {};
this._nrFetching = 0;
this._failed = {};
this._deferred = Q.defer();


if (mout.lang.isEmpty(this._targets)) {
process.nextTick(this._dissect.bind(this));


} else {
mout.object.forOwn(this._targets, this._fetch.bind(this));
}


return this._deferred.promise
.fin(function () {
this._working = false;
}.bind(this));
};

Manager.prototype.install = function () {
var destDir;
var deferred;
var that = this;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

destDir = path.join(this._config.cwd, this._config.directory);
deferred = Q.defer();

Q.nfcall(mkdirp, destDir)
.then(function () {
var promises = [];

mout.object.forOwn(that._dissected, function (decEndpoint, name) {
var promise;
var dest;
var release = decEndpoint.pkgMeta._release;

deferred.notify({
level: 'action',
tag: 'install',
data: name + (release ? '#' + release : ''),
pkgMeta: decEndpoint.pkgMeta,
origin: name,
endpoint: decEndpoint
});


dest = path.join(destDir, name);
