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
this._repository = new PackageRepository(this._config);

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

Manager.prototype.setResolutions = function (resolutions) {
this._resolutions = resolutions || {};
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
delete decEndpoint.promise;



if (decEndpoint.target === '*' && decEndpoint.pkgMeta.version) {
decEndpoint.target = '~' + decEndpoint.pkgMeta.version;
}



resolved = this._resolved[name] = this._resolved[name] || [];
index = mout.array.findIndex(resolved, function (resolved) {
return resolved.target === decEndpoint.target;
});
if (index !== -1) {
decEndpoint.dependants.push.apply(decEndpoint.dependants, resolved[index].dependants);
resolved.splice(index, 1);
}
resolved.push(decEndpoint);



if (!initialName) {
index = mout.array.findIndex(resolved, function (decEndpoint) {
return decEndpoint.initial;
});

if (index !== -1) {
resolved.splice(index, 1);
}
}


this._deferred.notify(decEndpoint);


this._parseDependencies(decEndpoint, pkgMeta, 'dependencies');

if (!this._production) {
this._parseDependencies(decEndpoint, pkgMeta, 'devDependencies');
}



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
if (this._hasFailed) {
return;
}

this._hasFailed = true;



this._failFastTimeout = setTimeout(function () {
this._nrFetching = Infinity;
this._dissect();
}.bind(this), 20000);
};

Manager.prototype._parseDependencies = function (decEndpoint, pkgMeta, jsonKey) {

mout.object.forOwn(pkgMeta[jsonKey], function (value, key) {
var resolved;
var beingFetched;
var compatible;
var childDecEndpoint = endpointParser.json2decomposed(key, value);

childDecEndpoint.dependants = childDecEndpoint.dependants || [];
childDecEndpoint.dependants.push(decEndpoint);



resolved = this._resolved[key];
if (resolved) {

compatible = mout.array.find(resolved, function (resolved) {
return this.areCompatible(resolved.target, childDecEndpoint.target);
}, this);

if (compatible) {

if (compatible.target === childDecEndpoint.target) {
compatible.dependants.push(decEndpoint);
} else {
childDecEndpoint.canonicalPkg = compatible.canonicalPkg;
childDecEndpoint.pkgMeta = compatible.pkgMeta;
this._resolved[key].push(childDecEndpoint);
}
return;
}
}



beingFetched = this._fetching[key];
if (beingFetched) {

compatible = mout.array.find(beingFetched, function (beingFetched) {
return this.areCompatible(beingFetched.target, childDecEndpoint.target);
}, this);


if (compatible) {

if (compatible.target === childDecEndpoint.target) {
compatible.dependants.push(decEndpoint);
} else {
compatible.promise.then(function () {
childDecEndpoint.canonicalPkg = compatible.canonicalPkg;
childDecEndpoint.pkgMeta = compatible.pkgMeta;
this._resolved[key].push(childDecEndpoint);
}.bind(this));
}
return;
}
}


this._fetch(childDecEndpoint);
}, this);
};

Manager.prototype._dissect = function () {
var err;
var promise = Q.resolve();
var suitables = {};
var that = this;



if (this._hasFailed) {
clearTimeout(this._failFastTimeout);

err = mout.object.values(this._failed)[0][0];
this._deferred.reject(err);
return;
}

mout.object.forOwn(this._resolved, function (decEndpoints, name) {
var semvers;
var nonSemvers;


semvers = decEndpoints.filter(function (decEndpoint) {
return !!decEndpoint.pkgMeta.version;
});


semvers.sort(function (first, second) {
if (semver.gt(first, second)) {
return -1;
}
if (semver.lt(first, second)) {
return 1;
}
return 0;
});


nonSemvers = decEndpoints.filter(function (decEndpoint) {
return !decEndpoint.pkgMeta.version;
});

promise = promise.then(function () {
return that._electSuitable(name, semvers, nonSemvers)
.then(function (suitable) {
suitables[name] = suitable;
});
});
}, this);





promise
.then(function () {

this._dissected = mout.object.filter(suitables, function (decEndpoint, name) {
var installedMeta = this._installed[name];
return !installedMeta || installedMeta._release !== decEndpoint.pkgMeta._release;
}, this);
