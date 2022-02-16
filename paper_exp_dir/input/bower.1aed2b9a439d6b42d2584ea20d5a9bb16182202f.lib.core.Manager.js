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
this._repository = new PackageRepository(this._config, this._logger);

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


if (this._hasFailed) {
return;
}


this._fetching[name] = this._fetching[name] || [];
this._fetching[name].push(decEndpoint);
this._nrFetching++;




return decEndpoint.promise = this._repository.fetch(decEndpoint)

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
decEndpoint.dependencies = decEndpoint.dependencies || {};


mout.object.forOwn(pkgMeta[jsonKey], function (value, key) {
var resolved;
var beingFetched;
var compatible;
var childDecEndpoint = endpointParser.json2decomposed(key, value);

decEndpoint.dependencies[key] = childDecEndpoint;
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
return semver.rcompare(first, second);
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

mout.object.forOwn(this._resolutions, function (resolution, name) {
if (this._conflicted[name]) {
return;
}

if (this._saveResolutions) {
this._logger.info('resolution', 'Removed unnecessary ' + name + '#' + resolution + ' resolution', {
name: name,
resolution: resolution,
action: 'delete'
});
delete this._resolutions[name];
} else {
this._logger.warn('resolution', 'Unnecessary ' + name + '#' + resolution + ' resolution', {
name: name,
resolution: resolution
});
}
}, this);


this._dissected = mout.object.filter(suitables, function (decEndpoint, name) {
var installedMeta = this._installed[name];
return !installedMeta || installedMeta._release !== decEndpoint.pkgMeta._release;
}, this);

return mout.object.map(this._dissected, function (decEndpoint) {
var data = this._toData(decEndpoint);
data.dependencies = mout.object.map(decEndpoint.dependencies, this._toData, this);
return data;
}, this);
}.bind(this))
.then(this._deferred.resolve, this._deferred.reject);
};

Manager.prototype._electSuitable = function (name, semvers, nonSemvers) {
var suitable;
var resolution;
var unresolvable;
var dataPicks;
var choices;
var picks = [];



if (semvers.length && nonSemvers.length) {
picks.push.apply(picks, semvers);
picks.push.apply(picks, nonSemvers);


} else if (nonSemvers.length) {
if (nonSemvers.length === 1) {
return Q.resolve(nonSemvers[0]);
}

picks.push.apply(picks, nonSemvers);


} else {
suitable = mout.array.find(semvers, function (subject) {
return semvers.every(function (decEndpoint) {
return semver.satisfies(subject.pkgMeta.version, decEndpoint.target);
});
});

if (suitable) {
return Q.resolve(suitable);
}

picks.push.apply(picks, semvers);
}


this._conflicted[name] = true;


picks.sort(function (pick1, pick2) {
var version1 = pick1.pkgMeta.version;
var version2 = pick2.pkgMeta.version;
var comp;


if (version1 && version2) {
comp = semver.compare(version1, version2);
if (!comp) {
return comp;
}
} else {

if (version1) {
}
if (version2) {
}
}


if (pick1.dependants.length > pick2.dependants.length) {
return -1;
}
if (pick1.dependants.length < pick2.dependants.length) {
return 1;
}

return 0;
});


dataPicks = picks.map(function (pick) {
var dataPick = this._toData(pick);
dataPick.dependants = pick.dependants.map(this._toData.bind(this), this);
return dataPick;
}, this);




resolution = this._resolutions[name];
unresolvable = mout.object.find(this._targets, function (target) {
return target.name === name && target.unresolvable;
});

if (resolution && !unresolvable) {
if (semver.valid(resolution) != null || semver.validRange(resolution) != null) {
suitable = mout.array.findIndex(picks, function (pick) {
return semver.satisfies(pick.pkgMeta.version, resolution);
});
} else {
suitable = mout.array.findIndex(picks, function (pick) {
return pick.pkgMeta._release === resolution;
});
}

if (suitable === -1) {
this._logger.warn('resolution', 'Unsuitable resolution declared for ' + name + ': ' + resolution, {
name: name,
picks: dataPicks,
resolution: resolution
});
} else {
this._logger.conflict('solved', 'Unable to find suitable version for ' + name, {
name: name,
picks: dataPicks,
resolution: resolution,
suitable: dataPicks[suitable]
});
return Q.resolve(picks[suitable]);
}
}


if (!this._config.interactive) {
throw createError('Unable to find suitable version for ' + name, 'ECONFLICT', {
name: name,
picks: dataPicks
});
}


this._logger.conflict('incompatible', 'Unable to find suitable version for ' + name, {
name: name,
picks: dataPicks,
saveResolutions: this._saveResolutions
});

choices = picks.map(function (pick, index) { return index + 1; });
return Q.nfcall(promptly.choose, 'Choice:', choices)
.then(function (choice) {
var pick = picks[choice - 1];
var resolution;


if (pick.target === '*') {
resolution = pick.pkgMeta._release || '*';
} else {
resolution = pick.target;
}

if (this._saveResolutions) {
this._logger.info('resolution', 'Saved ' + name + '#' + resolution + ' as resolution', {
name: name,
resolution: resolution,
action: this._resolutions[name] ? 'edit' : 'add'
});
this._resolutions[name] = resolution;
}

return pick;
}.bind(this));
};

Manager.prototype._toData = function (decEndpoint) {
return {
endpoint: mout.object.pick(decEndpoint, ['name', 'source', 'target']),
canonicalPkg: decEndpoint.canonicalPkg,
pkgMeta: decEndpoint.pkgMeta
};
};

Manager.prototype._getCap = function (comparators, side) {
var matches;
var candidate;
var cap = {};
var compare = side === 'lowest' ? semver.lt : semver.gt;

comparators.forEach(function (comparator) {


if (Array.isArray(comparator)) {
candidate = this._getCap(comparator, side);


if (!cap.version || compare(candidate.version, cap.version)) {
cap = candidate;
}


} else {
matches = comparator.match(/(.*?)(\d+\.\d+\.\d+.*)$/);
if (!matches) {
return;
}


if (!cap.version || compare(matches[2], cap.version)) {
cap.version = matches[2];
cap.comparator = matches[1];
}
}
}, this);

return cap;
};

module.exports = Manager;
