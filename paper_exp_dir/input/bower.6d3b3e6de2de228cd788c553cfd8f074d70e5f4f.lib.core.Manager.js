var Q = require('q');
var mout = require('mout');
var semver = require('semver');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var promptly = require('promptly');
var PackageRepository = require('./PackageRepository');
var copy = require('../util/copy');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');

function Manager(config, logger) {
this._config = config;
this._logger = logger;

this.setResolutions();
this.configure();
}



Manager.prototype.setProduction = function (production) {
this._production = production;
return this;
};

Manager.prototype.getResolutions = function () {
return this._resolutions;
};

Manager.prototype.setResolutions = function (resolutions, save) {
this._resolutions = resolutions || {};
this._saveResolutions = !!save;
return this;
};

Manager.prototype.configure = function (targets, resolved, installed) {

if (this._working) {
throw createError('Can\'t configure while working', 'EWORKING');
}

targets = targets || [];
this._targets = targets;
this._resolved = {};
this._installed = {};


targets.forEach(function (decEndpoint) {
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);
}, this);


mout.object.forOwn(resolved, function (decEndpoint, name) {
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);
this._resolved[name] = [decEndpoint];
this._installed[name] = decEndpoint.pkgMeta;
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
this._conflicted = {};
this._hasFailed = false;
this._deferred = Q.defer();


if (!this._targets.length) {
process.nextTick(this._dissect.bind(this));


} else {
this._targets.forEach(this._fetch.bind(this));
}


return this._deferred.promise
.fin(function () {
this._working = false;
}.bind(this));
};

Manager.prototype.install = function () {
var destDir;
var that = this;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

destDir = path.join(this._config.cwd, this._config.directory);
return Q.nfcall(mkdirp, destDir)
.then(function () {
var promises = [];

mout.object.forOwn(that._dissected, function (decEndpoint, name) {
var promise;
var dest;
var release = decEndpoint.pkgMeta._release;
var data = that._toData(decEndpoint);

that._logger.action('install', name + (release ? '#' + release : ''), data);


dest = path.join(destDir, name);
promise = Q.nfcall(rimraf, dest)
.then(copy.copyDir.bind(copy, decEndpoint.canonicalPkg, dest))
.fail(function (err) {
err.data = err.data;
throw err;
});

promises.push(promise);
});

return Q.all(promises);
})
.then(function () {
return mout.object.map(that._dissected, function (decEndpoint) {
var data = this._toData(decEndpoint);
data.dependencies = mout.object.map(decEndpoint.dependencies, this._toData, this);
return data;
}, that);
})
.fin(function () {
this._working = false;
}.bind(this));
};

Manager.prototype.areCompatible = function (first, second) {
var validFirst = semver.valid(first) != null;
var validSecond = semver.valid(second) != null;
var validRangeFirst;
var validRangeSecond;
var rangeSecond;
var rangeFirst;


if (validFirst && validSecond) {
return semver.eq(first, second);
}


validRangeFirst = semver.validRange(first) != null;
if (validRangeFirst && validSecond) {
return semver.satisfies(second, first);
}


validRangeSecond = semver.validRange(second) != null;
if (validFirst && validRangeSecond) {
return semver.satisfies(first, second);
}


if (validRangeFirst && validRangeSecond) {

if (first === '*' && second === '*') {
return true;
}

rangeFirst = {};
rangeSecond = {};


rangeFirst.max = this._getCap(semver.toComparators(first), 'highest');
rangeSecond.max = this._getCap(semver.toComparators(second), 'highest');


rangeFirst.min = this._getCap(semver.toComparators(first), 'lowest');
rangeSecond.min = this._getCap(semver.toComparators(second), 'lowest');



return semver.eq(rangeFirst.max.version, rangeSecond.max.version) &&
rangeFirst.max.comparator === rangeSecond.max.comparator &&
semver.eq(rangeFirst.min.version, rangeSecond.min.version) &&
rangeFirst.min.comparator === rangeSecond.min.comparator;
}


return first === second;
};



Manager.prototype._fetch = function (decEndpoint) {
var name = decEndpoint.name;

