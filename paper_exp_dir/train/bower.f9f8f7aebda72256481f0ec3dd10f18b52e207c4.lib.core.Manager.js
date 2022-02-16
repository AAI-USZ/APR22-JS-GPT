var Q = require('q');
var mout = require('mout');
var semver = require('semver');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var fs = require('fs');
var promptly = require('promptly');
var PackageRepository = require('./PackageRepository');
var copy = require('../util/copy');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');

function Manager(config, logger) {
this._config = config;
this._logger = logger;
this._repository = new PackageRepository(this._config, this._logger);

this.configure({});
}



Manager.prototype.configure = function (setup) {

this._targets = this._uniquify(setup.targets || []);
this._targets.forEach(function (decEndpoint) {
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);
});


this._resolved = {};
this._installed = {};
mout.object.forOwn(setup.resolved, function (decEndpoint, name) {
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);
this._resolved[name] = [decEndpoint];
this._installed[name] = decEndpoint.pkgMeta;
}, this);


mout.object.mixIn(this._installed, setup.installed);


this._conflicted = {};
this._incompatibles = {};
setup.incompatibles = this._uniquify(setup.incompatibles || []);
setup.incompatibles.forEach(function (decEndpoint) {
var name = decEndpoint.name;
var target;


target = mout.array.find(this._targets, function (target) {
return mout.object.equals(decEndpoint, target);
});
if (!target) {
this._incompatibles[name] = this._incompatibles[name] || [];
this._incompatibles[name].push(decEndpoint);
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);
}

this._conflicted[name] = true;
}, this);


this._resolutions = setup.resolutions || {};

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
var componentsDir;
var that = this;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

componentsDir = path.join(this._config.cwd, this._config.directory);
return Q.nfcall(mkdirp, componentsDir)
.then(function () {
var promises = [];

mout.object.forOwn(that._dissected, function (decEndpoint, name) {
var promise;
var dst;
var release = decEndpoint.pkgMeta._release;

that._logger.action('install', name + (release ? '#' + release : ''), that.toData(decEndpoint));


dst = path.join(componentsDir, name);
decEndpoint.dst = dst;

promise = Q.nfcall(rimraf, dst)
.then(copy.copyDir.bind(copy, decEndpoint.canonicalDir, dst))
.then(function () {
var jsonFile = path.join(dst, '.bower.json');


return Q.nfcall(fs.readFile, jsonFile)
.then(function (contents) {
var json = JSON.parse(contents.toString());
json._target = decEndpoint.target;
json = JSON.stringify(json, null, '  ');

return Q.nfcall(fs.writeFile, jsonFile, json);
});
});

promises.push(promise);
});

return Q.all(promises);
})
.then(function () {

return mout.object.map(that._dissected, function (decEndpoint) {
var pkg = this.toData(decEndpoint);
pkg.canonicalDir = decEndpoint.dst;
return pkg;
}, that);
})
.fin(function () {
this._working = false;
}.bind(this));
};

Manager.prototype.areCompatible = function (candidate, resolved) {
var resolvedVersion;
var highestCandidate;
var highestResolved;


if (candidate.target === resolved.target) {
return true;
}

resolvedVersion = resolved.pkgMeta && resolved.pkgMeta.version;
if (!resolvedVersion) {
return false;
}


if (semver.valid(candidate.target) != null) {
return semver.eq(candidate.target, resolvedVersion);
}



if (semver.validRange(candidate.target) != null) {
highestCandidate = this._getCap(semver.toComparators(candidate.target), 'highest');
highestResolved = this._getCap(semver.toComparators(resolved.target), 'highest');

return semver.eq(highestCandidate.version, highestResolved.version) &&
highestCandidate.comparator === highestResolved.comparator &&
semver.satisfies(resolvedVersion, candidate.target);
}

return false;
};

Manager.prototype.toData = function (decEndpoint, extraKeys) {
var names;

var data = {};
data.endpoint = mout.object.pick(decEndpoint, ['name', 'source', 'target']);
mout.object.mixIn(data, mout.object.pick(decEndpoint, ['canonicalDir', 'pkgMeta']));

if (extraKeys) {
mout.object.mixIn(data, mout.object.pick(decEndpoint, extraKeys));
}

if (decEndpoint.dependencies) {
data.dependencies = {};



names = Object.keys(decEndpoint.dependencies).sort();
names.forEach(function (name) {
data.dependencies[name] = this.toData(decEndpoint.dependencies[name], extraKeys);
}, this);
}

return data;
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

Manager.prototype._onFetchSuccess = function (decEndpoint, canonicalDir, pkgMeta) {
var name;
var resolved;
var index;
var incompatibles;
var initialName = decEndpoint.name;


mout.array.remove(this._fetching[initialName], decEndpoint);
this._nrFetching--;


decEndpoint.name = name = decEndpoint.name || pkgMeta.name;
decEndpoint.canonicalDir = canonicalDir;
decEndpoint.pkgMeta = pkgMeta;
delete decEndpoint.promise;




resolved = this._resolved[name] = this._resolved[name] || [];
index = mout.array.findIndex(resolved, function (resolved) {
return resolved.target === decEndpoint.target;
});
if (index !== -1) {

decEndpoint.dependants.push.apply(decEndpoint.dependants, resolved[index.dependants]);
decEndpoint.dependants = this._uniquify(decEndpoint.dependants);
resolved.splice(index, 1);
}
resolved.push(decEndpoint);


this._parseDependencies(decEndpoint, pkgMeta, 'dependencies');



incompatibles = this._incompatibles[name];
if (incompatibles) {
incompatibles.forEach(this._fetch.bind(this));
delete this._incompatibles[name];
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



resolved = this._resolved[key];
if (resolved) {
compatible = mout.array.find(resolved, function (resolved) {
return this.areCompatible(childDecEndpoint, resolved);
}, this);

if (compatible) {

if (compatible.target === childDecEndpoint.target) {
decEndpoint.dependencies[key] = compatible;
compatible.dependants.push(decEndpoint);
compatible.dependants = this._uniquify(compatible.dependants);

} else {
childDecEndpoint.canonicalDir = compatible.canonicalDir;
childDecEndpoint.pkgMeta = compatible.pkgMeta;
childDecEndpoint.dependencies = compatible.dependencies;
this._resolved[key].push(childDecEndpoint);
}
return;
}
}



beingFetched = this._fetching[key];
if (beingFetched) {
compatible = mout.array.find(beingFetched, function (beingFetched) {
return this.areCompatible(childDecEndpoint, beingFetched);
}, this);

if (compatible) {
compatible.promise
.then(function () {
this._parseDependencies(decEndpoint, pkgMeta, jsonKey);
}.bind(this));
return;
}
}


decEndpoint.dependencies[key] = childDecEndpoint;
childDecEndpoint.dependants = [decEndpoint];
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


decEndpoints.forEach(function (decEndpoint) {
if (decEndpoint.target === '*' && decEndpoint.pkgMeta.version) {
decEndpoint.target = '~' + decEndpoint.pkgMeta.version;
}
});


semvers = decEndpoints.filter(function (decEndpoint) {
return !!decEndpoint.pkgMeta.version;
});


semvers.sort(function (first, second) {
return semver.rcompare(first.pkgMeta.version, second.pkgMeta.version);
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

this._logger.info('resolution', 'Removed unnecessary ' + name + '#' + resolution + ' resolution', {
name: name,
resolution: resolution,
action: 'delete'
});

delete this._resolutions[name];
}, this);


this._dissected = mout.object.filter(suitables, function (decEndpoint, name) {
var installedMeta = this._installed[name];

return !installedMeta ||
installedMeta._release !== decEndpoint.pkgMeta._release ||
installedMeta._target !== decEndpoint.target;
}, this);


return mout.object.map(this._dissected, function (decEndpoint) {
return this.toData(decEndpoint);
}, this);
}.bind(this))
.then(this._deferred.resolve, this._deferred.reject);
};

Manager.prototype._electSuitable = function (name, semvers, nonSemvers) {
var suitable;
var resolution;
var unresolvable;
var dataPicks;
var save;
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
if (comp) {
return comp;
}
} else {

if (version1) {
return -1;
}
if (version2) {
return 1;
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
var dataPick = this.toData(pick);
dataPick.dependants = pick.dependants.map(this.toData, this);
dataPick.dependants.sort(function (dependant1, dependant2) {
return dependant1.endpoint.name.localeCompare(dependant2.endpoint.name);
});
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
picks: dataPicks
});

choices = picks.map(function (pick, index) { return index + 1; });
return Q.nfcall(promptly.choose, 'Choice:', choices, {
validator: function (choice) {
if (choice.charAt(0) === '!') {
choice = choice.substr(1);
save = true;
}

return choice;
}
})
.then(function (choice) {
var pick = picks[choice - 1];
var resolution;


if (pick.target === '*') {
resolution = pick.pkgMeta._release || '*';
} else {
resolution = pick.target;
}

if (save) {
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

Manager.prototype._uniquify = function (decEndpoints) {
var length = decEndpoints.length;

return decEndpoints.filter(function (decEndpoint, index) {
var x;
var current;

for (x = index + 1; x < length; ++x) {
current = decEndpoints[x];
if (current.name === decEndpoint.name && current.target === decEndpoint.target) {
return false;
}
}

return true;
});
};

module.exports = Manager;
