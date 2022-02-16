var Q = require('q');
var mout = require('mout');
var semver = require('semver');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var fs = require('graceful-fs');
var promptly = require('promptly');
var endpointParser = require('bower-endpoint-parser');
var PackageRepository = require('./PackageRepository');
var copy = require('../util/copy');
var createError = require('../util/createError');

function Manager(config, logger) {
this._config = config;
this._logger = logger;
this._repository = new PackageRepository(this._config, this._logger);

this.configure({});
}



Manager.prototype.configure = function (setup) {
var targetsHash = {};

this._conflicted = {};


this._targets = setup.targets || [];
this._targets.forEach(function (decEndpoint) {
decEndpoint.initialName = decEndpoint.name;
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);
targetsHash[decEndpoint.name] = true;


decEndpoint.unresolvable = !!decEndpoint.newly;
});


this._resolved = {};
this._installed = {};
mout.object.forOwn(setup.resolved, function (decEndpoint, name) {
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);
this._resolved[name] = [decEndpoint];
this._installed[name] = decEndpoint.pkgMeta;
}, this);


mout.object.mixIn(this._installed, setup.installed);


this._incompatibles = {};
setup.incompatibles = this._uniquify(setup.incompatibles || []);
setup.incompatibles.forEach(function (decEndpoint) {
var name = decEndpoint.name;

this._incompatibles[name] = this._incompatibles[name] || [];
this._incompatibles[name].push(decEndpoint);
decEndpoint.dependants = mout.object.values(decEndpoint.dependants);


this._conflicted[name] = true;


if (!targetsHash[name] && !this._resolved[name]) {
this._targets.push(decEndpoint);
}
}, this);


this._resolutions = setup.resolutions || {};


this._targets = this._uniquify(this._targets);


this._forceLatest = !!setup.forceLatest;

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


promise = Q.nfcall(rimraf, dst)
.then(copy.copyDir.bind(copy, decEndpoint.canonicalDir, dst))
.then(function () {
var metaFile = path.join(dst, '.bower.json');

decEndpoint.canonicalDir = dst;


return Q.nfcall(fs.readFile, metaFile)
.then(function (contents) {
var json = JSON.parse(contents.toString());

json._target = decEndpoint.target;
if (decEndpoint.newly) {
json._direct = true;
}

json = JSON.stringify(json, null, '  ');
return Q.nfcall(fs.writeFile, metaFile, json);
});
});

promises.push(promise);
});

