var Q = require('q');
var mout = require('mout');
var semver = require('semver');
var PackageRepository = require('./PackageRepository');
var defaultConfig = require('../config');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');

var Manager = function (options) {
options = options || {};

this._config = options.config || defaultConfig;
this._repository = new PackageRepository(options);
};

Manager.prototype.configure = function (targets, resolved) {

if (this._working) {
throw createError('Can\'t configure while resolving', 'EWORKING');
}


this._targets = {};
this._resolved = {};


targets.forEach(function (decEndpoint) {
this._targets[decEndpoint.name] = decEndpoint;
}.bind(this));


if (resolved) {
resolved.forEach(function (decEndpoint) {

if (!decEndpoint.name) {
throw createError('Name must be set when configuring resolved endpoints');
}
this._resolved[decEndpoint.name] = [decEndpoint];
decEndpoint.initial = true;
}, this);
}

return this;
};

Manager.prototype.resolve = function () {

if (this._working) {
return Q.reject(createError('Already resolving', 'EWORKING'));
}


this._fetching = {};
this._nrFetching = 0;
this._failed = {};

this._deferred = Q.defer();


mout.object.forOwn(this._targets, this._fetch.bind(this));

return this._deferred.promise
.fin(function () {
this._working = false;
}.bind(this));
};

Manager.prototype.areCompatible = function (source, subject) {
var validSource = semver.valid(source.target) != null;
var validSubject = semver.valid(subject.target) != null;
var validRangeSource = semver.validRange(source.target) != null;
var validRangeSubject = semver.validRange(subject.target) != null;

var highestSubject;
var highestSource;


if (validSource && validSubject) {
return semver.eq(source.target, subject.target);
}


if (validRangeSource && validSubject) {
return semver.satisfies(subject.target, source.target);
}


if (validSource && validRangeSubject) {
return semver.satisfies(source.target, subject.target);
}


if (validRangeSource && validRangeSubject) {

if (source.target === '*' && subject.target === '*') {
return true;
}


highestSubject = this._findHighestVersion(semver.toComparators(subject.target));
highestSource = this._findHighestVersion(semver.toComparators(source.target));



return semver.eq(highestSubject, highestSource);
}


return source.target === subject.target;
};



Manager.prototype._fetch = function (decEndpoint) {
var name = decEndpoint.name;


this._fetching[name] = this._fetching[name] || [];
this._fetching[name].push(decEndpoint);
this._nrFetching++;




decEndpoint.promise = this._repository.fetch(decEndpoint)

.spread(this._onFetch.bind(this, decEndpoint))


.progress(function (notification) {
notification.endpoint = decEndpoint;
notification.from = decEndpoint.name || decEndpoint.resolverName;
this._deferred.notify(notification);
}.bind(this));

return decEndpoint.promise;
};

Manager.prototype._onFetch = function (decEndpoint, canonicalPkg, pkgMeta) {
var json;
var name;
