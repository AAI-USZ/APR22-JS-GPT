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
var extra;

var data = {};
data.endpoint = mout.object.pick(decEndpoint, ['name', 'source', 'target']);
mout.object.mixIn(data, mout.object.pick(decEndpoint, ['canonicalDir', 'pkgMeta']));

if (extraKeys) {
extra = mout.object.pick(decEndpoint, extraKeys);
extra = mout.object.filter(extra, function (value) {
return !!value;
