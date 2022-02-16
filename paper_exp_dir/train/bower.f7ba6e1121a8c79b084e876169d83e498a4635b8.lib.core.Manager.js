var Q = require('q');
var mout = require('mout');
var semver = require('semver');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var fs = require('graceful-fs');
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

this._incompatibles[name] = this._incompatibles[name] || [];
this._incompatibles[name].push(decEndpoint);
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);

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


if (semver.valid(candidate.target)) {
return semver.eq(candidate.target, resolvedVersion);
}



if (semver.validRange(candidate.target)) {
highestCandidate = this._getCap(semver.toComparators(candidate.target), 'highest');
highestResolved = this._getCap(semver.toComparators(resolved.target), 'highest');

return highestCandidate.version && highestResolved.version &&
semver.eq(highestCandidate.version, highestResolved.version) &&
highestCandidate.comparator === highestResolved.comparator &&
semver.satisfies(resolvedVersion, candidate.target);
}

return false;
};

Manager.prototype.toData = function (decEndpoint, extraKeys) {
var names;
var extra;

var data = {};
data.endpoint = mout.object.pick(decEndpoint, ['name', 'source', 'target']);
mout.object.mixIn(data, mout.object.pick(decEndpoint, ['canonicalDir', 'pkgMeta']));

if (extraKeys) {
extra = mout.object.pick(decEndpoint, extraKeys);
extra = mout.object.filter(extra, function (value) {
return !!value;
});
mout.object.mixIn(data, extra);
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
var fetching = this._fetching[initialName];


mout.array.remove(fetching, decEndpoint);
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

incompatibles = incompatibles.filter(function (incompatible) {
return !resolved.some(function (decEndpoint) {
return incompatible.target === decEndpoint.target;
});
}, this);

incompatibles = incompatibles.filter(function (incompatible) {
return !fetching.some(function (decEndpoint) {
return incompatible.target === decEndpoint.target;
});
}, this);

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
var fetching;
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



fetching = this._fetching[key];
if (fetching) {
compatible = mout.array.find(fetching, function (fetching) {
return this.areCompatible(childDecEndpoint, fetching);
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


semvers = decEndpoints.filter(function (decEndpoint) {
return !!decEndpoint.pkgMeta.version;
});


semvers.sort(function (first, second) {
var result = semver.rcompare(first.pkgMeta.version, second.pkgMeta.version);



