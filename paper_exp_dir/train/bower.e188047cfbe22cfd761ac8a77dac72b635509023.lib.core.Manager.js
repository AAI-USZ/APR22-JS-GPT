var Q = require('q');
var mout = require('mout');
var semver = require('semver');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var PackageRepository = require('./PackageRepository');
var copy = require('../util/copy');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');

function Manager(config, logger) {
this._config = config;
this._logger = logger;
this._repository = new PackageRepository(this._config);
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
this._hasFailed = false;
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
var data = {
endpoint: mout.object.pick(decEndpoint, ['name', 'source', 'target']),
canonicalPkg: decEndpoint.canonicalPkg,
pkgMeta: decEndpoint.pkgMeta
};

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
return decEndpoint.pkgMeta;
});
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
var highestSecond;
var highestFirst;


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


highestSecond = this._findHighestVersion(semver.toComparators(second));
highestFirst = this._findHighestVersion(semver.toComparators(first));



return semver.eq(highestSecond, highestFirst);
}


return first === second;
};



Manager.prototype._fetch = function (decEndpoint) {
var name = decEndpoint.name;
var logger;


if (this._hasFailed) {
return;
}


this._fetching[name] = this._fetching[name] || [];
this._fetching[name].push(decEndpoint);
this._nrFetching++;



logger = this._logger.geminate().intercept(function (log) {
log.data = log.data || [];
log.data.endpoint = mout.object.pick(decEndpoint, ['name', 'source', 'target']);
});




return decEndpoint.promise = this._repository.fetch(decEndpoint, logger)

.spread(this._onFetchSuccess.bind(this, decEndpoint))



.fail(this._onFetchError.bind(this, decEndpoint));
};

Manager.prototype._onFetchSuccess = function (decEndpoint, canonicalPkg, pkgMeta) {
var name;
var resolved;
var index;
var initialName = decEndpoint.name;


mout.array.remove(this._fetching[initialName], decEndpoint);
this._nrFetching--;


decEndpoint.name = name = decEndpoint.name || pkgMeta.name;
decEndpoint.canonicalPkg = canonicalPkg;
decEndpoint.pkgMeta = pkgMeta;


resolved = this._resolved[name] = this._resolved[name] || [];
resolved.push(decEndpoint);
delete decEndpoint.promise;



if (!initialName) {
index = mout.array.findIndex(resolved, function (decEndpoint) {
return decEndpoint.initial;
});

if (index !== -1) {
resolved.splice(index, 1);
}
}


this._parseDependencies(decEndpoint, pkgMeta);



if (this._nrFetching <= 0) {
process.nextTick(this._dissect.bind(this));
}
};

Manager.prototype._onFetchError = function (decEndpoint, err) {
var name = decEndpoint.name;

err.data = err.data || {};
err.data.endpoint = mout.object.pick(decEndpoint, ['name', 'source', 'target']);


mout.array.remove(this._fetching[name], decEndpoint);
this._nrFetching--;


this._failed[name] = this._failed[name] || [];
this._failed[name].push(err);
delete decEndpoint.promise;


this._failFast();



if (this._nrFetching <= 0) {
process.nextTick(this._dissect.bind(this));
}
};

Manager.prototype._failFast = function () {
if (this._failFastTimeout) {
return;
}

this._hasFailed = true;



this._failFastTimeout = setTimeout(function () {
this._nrFetching = Infinity;
this._dissect();
}.bind(this), 20000);
};

Manager.prototype._parseDependencies = function (decEndpoint, pkgMeta) {

mout.object.forOwn(pkgMeta.dependencies, function (value, key) {
var resolved;
var beingFetched;
