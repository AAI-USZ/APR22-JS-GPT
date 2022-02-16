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
var resolved;
var index;
var initialName = decEndpoint.name;


mout.array.remove(this._fetching[initialName], decEndpoint);
this._nrFetching--;


decEndpoint.dir = canonicalPkg;
decEndpoint.name = name = decEndpoint.name || pkgMeta.name;
decEndpoint.json = json = pkgMeta;


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


this._parseDependencies(decEndpoint, json);



if (this._nrFetching <= 0) {
process.nextTick(this._finish.bind(this));
}
};

Manager.prototype._parseDependencies = function (decEndpoint, json) {

mout.object.forOwn(json.dependencies, function (endpoint, name) {
var decEndpoints;
var compatible;
var childDecEndpoint = endpointParser.decompose(endpoint);



if (semver.valid(childDecEndpoint.source) != null || semver.validRange(childDecEndpoint.source) != null) {
childDecEndpoint.target = childDecEndpoint.source;
childDecEndpoint.source = name;
}


childDecEndpoint.name = name;



decEndpoints = this._resolved[name];
if (decEndpoints) {
compatible = mout.array.find(decEndpoints, function (resolved) {
return this.areCompatible(resolved, childDecEndpoint);
}, this);


if (compatible) {
childDecEndpoint.dir = compatible.dir;
childDecEndpoint.json = compatible.json;
this._resolved[name].push(childDecEndpoint);
return;
}
}



decEndpoints = this._fetching[name];
if (decEndpoints) {
compatible = mout.array.find(decEndpoints, function (beingFetched) {
return this.areCompatible(beingFetched, childDecEndpoint);
}, this);


if (compatible) {
childDecEndpoint = compatible.promise.then(function () {
childDecEndpoint.dir = compatible.dir;
childDecEndpoint.json = compatible.json;
this._resolved[name].push(childDecEndpoint);
}.bind(this));

return;
}
}


this._fetch(childDecEndpoint);
}, this);
};

Manager.prototype._finish = function () {
var parsed = {};

mout.object.forOwn(this._resolved, function (decEndpoints, name) {
var configured = this._targets[name];
var nonSemver;
var validSemver;
var suitable;



if (configured && configured.target && !semver.valid(configured.target)) {
parsed[name] = this._targets[name];

return;
}


nonSemver = decEndpoints.filter(function (decEndpoint) {
return !decEndpoint.json.version;
});


validSemver = decEndpoints.filter(function (decEndpoint) {
return !!decEndpoint.json.version;
});


validSemver.sort(function (first, second) {
if (semver.gt(first, second)) {
return -1;
} else if (semver.lt(first, second)) {
return 1;
} else {
return 0;
}
});


if (!validSemver.length) {

suitable = nonSemver[0];

} else {

suitable = mout.array.find(validSemver, function (subject) {
return validSemver.every(function (decEndpoint) {
return semver.satisfies(subject.json.version, decEndpoint.target);
});
});
}



if (suitable) {
parsed[name] = suitable;
} else {
throw new Error('No suitable version for "' + name + '"');
}
}, this);

this._deferred.resolve(parsed);
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
