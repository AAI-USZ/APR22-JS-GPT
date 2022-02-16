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

deferred.notify(that._extendNotification({
level: 'action',
tag: 'install',
data: name + (release ? '#' + release : ''),
pkgMeta: decEndpoint.pkgMeta
}, decEndpoint));


dest = path.join(destDir, name);
promise = Q.nfcall(rimraf, dest)
.then(copy.copyDir.bind(copy, decEndpoint.dir, dest));

promises.push(promise);
});

return Q.all(promises);
})
.then(function () {


return mout.object.map(that._dissected, function (decEndpoint) {
return decEndpoint.pkgMeta;
});
})
.then(deferred.resolve, deferred.reject, deferred.notify);


return deferred.promise
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
var deferred = this._deferred;
var that = this;


this._fetching[name] = this._fetching[name] || [];
this._fetching[name].push(decEndpoint);
this._nrFetching++;




decEndpoint.promise = this._repository.fetch(decEndpoint)

.spread(this._onFetch.bind(this, deferred, decEndpoint))

.fail(function (err) {
that._extendNotification(err, decEndpoint);
deferred.reject(err);
})


.progress(function (notification) {
that._extendNotification(notification, decEndpoint);
deferred.notify(notification);
});

return decEndpoint.promise;
};

Manager.prototype._onFetch = function (deferred, decEndpoint, canonicalPkg, pkgMeta) {
var name;
var resolved;
var index;
var initialName = decEndpoint.name;



if (deferred.promise.isRejected()) {
return;
}


mout.array.remove(this._fetching[initialName], decEndpoint);
this._nrFetching--;


decEndpoint.name = name = decEndpoint.name || pkgMeta.name;
decEndpoint.dir = canonicalPkg;
decEndpoint.pkgMeta = pkgMeta;


resolved = this._resolved[name] = this._resolved[name] || [];
resolved.push(decEndpoint);
delete decEndpoint.promise;



if (!initialName) {
index = mout.array.findIndex(resolved, function (decEndpoint) {
return decEndpoint.installed;
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

Manager.prototype._parseDependencies = function (decEndpoint, pkgMeta) {

mout.object.forOwn(pkgMeta.dependencies, function (value, key) {
var resolved;
var beingFetched;
var compatible;
var childDecEndpoint = endpointParser.json2decomposed(key, value);



resolved = this._resolved[key];
if (resolved) {
compatible = mout.array.find(resolved, function (resolved) {
return this.areCompatible(resolved.target, childDecEndpoint.target);
}, this);


if (compatible) {
childDecEndpoint.dir = compatible.dir;
childDecEndpoint.pkgMeta = compatible.pkgMeta;
this._resolved[key].push(childDecEndpoint);
return;
}
}



beingFetched = this._fetching[key];
if (beingFetched) {
compatible = mout.array.find(beingFetched, function (beingFetched) {
return this.areCompatible(beingFetched.target, childDecEndpoint.target);
}, this);


if (compatible) {
childDecEndpoint = compatible.promise.then(function () {
childDecEndpoint.dir = compatible.dir;
childDecEndpoint.pkgMeta = compatible.pkgMeta;
this._resolved[key].push(childDecEndpoint);
}.bind(this));

return;
}
}


this._fetch(childDecEndpoint);
}, this);
};

Manager.prototype._dissect = function () {
var pkgMetas;
var dissected = {};

mout.object.forOwn(this._resolved, function (decEndpoints, name) {
var target = this._targets[name];
var nonSemver;
var validSemver;
var suitable;



if (target && target.target && !semver.valid(target.target)) {
dissected[name] = this._targets[name];

return;
}


nonSemver = decEndpoints.filter(function (decEndpoint) {
return !decEndpoint.pkgMeta.version;
});


validSemver = decEndpoints.filter(function (decEndpoint) {
return !!decEndpoint.pkgMeta.version;
});


validSemver.sort(function (first, second) {
if (semver.gt(first, second)) {
return -1;
}
if (semver.lt(first, second)) {
return 1;
}



return first.installed ? -1 : (second.installed ? 1 : 0);
});


if (!validSemver.length) {

suitable = nonSemver[0];

} else {

suitable = mout.array.find(validSemver, function (subject) {
return validSemver.every(function (decEndpoint) {
return semver.satisfies(subject.pkgMeta.version, decEndpoint.target);
});
});
}



if (suitable) {
dissected[name] = suitable;
} else {
throw new Error('No suitable version for "' + name + '"');
}
}, this);


this._dissected = mout.object.filter(dissected, function (decEndpoint) {
return !decEndpoint.installed;
});


pkgMetas = mout.object.map(this._dissected, function (decEndpoint) {
return decEndpoint.pkgMeta;
});
this._deferred.resolve(pkgMetas);
};

Manager.prototype._extendNotification = function (notification, decEndpoint) {
notification.origin = decEndpoint.name || decEndpoint.registryName || decEndpoint.resolverName;
notification.endpoint = {
name: decEndpoint.name,
source: decEndpoint.source,
target: decEndpoint.target
};

return notification;
};

Manager.prototype._findHighestVersion = function (comparators) {
var highest;
var matches;
var version;

comparators.forEach(function (comparator) {


if (Array.isArray(comparator)) {
version = this._findHighestVersion(comparator);


} else {
matches = comparator.match(/\d+\.\d+\.\d+.*$/);
if (!matches) {
return;
}

version = matches[0];
}


if (!highest || semver.gt(version, highest)) {
highest = version;
}
}, this);

return highest;
};

module.exports = Manager;
