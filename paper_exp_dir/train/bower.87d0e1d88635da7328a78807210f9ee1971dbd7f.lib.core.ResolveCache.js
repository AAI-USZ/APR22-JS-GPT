var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var semver = require('semver');
var mout = require('mout');
var Q = require('q');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var ResolveCache = function (dir) {





this._dir = dir;
this._versions = {};

mkdirp.sync(dir);
};

ResolveCache.prototype.retrieve = function (source, target) {
var sourceId = this._getSourceId(source);
var dir = path.join(this._dir, sourceId);

target = target || '*';

return this._getVersions(source)
.then(function (versions) {
var suitable;


if (semver.valid(target) != null || semver.validRange(target) != null) {
suitable = mout.array.find(versions, function (version) {
return semver.satisfies(version, target);
});

if (suitable) {
return suitable;
}
}


if (target === '*') {
return mout.array.find(versions, function (version) {
return version === '_unversioned';
});
}


return mout.array.find(versions, function (version) {
return version === target;
});
})
.then(function (version) {
var canonicalPkg;

if (!version) {
return [];
}


canonicalPkg = path.join(dir, version);
return this._readPkgMeta(canonicalPkg)
.then(function (pkgMeta) {
return [canonicalPkg, pkgMeta];
});
}.bind(this));
};

ResolveCache.prototype.store = function (canonicalPkg, pkgMeta) {
var promise = pkgMeta ? Q.resolve(pkgMeta) : this._readPkgMeta(canonicalPkg);
var sourceId;
var pkgVersion;
var dir;

return promise
.then(function (pkgMeta) {
sourceId = this._getSourceId(pkgMeta._source);
pkgVersion = pkgMeta.version || '_unversioned';
dir = path.join(this._dir, sourceId, pkgVersion);


return Q.nfcall(fs.stat, dir)
.then(function () {

return Q.nfcall(rimraf, dir);
}, function (err) {


if (err.code === 'ENOENT') {
return Q.nfcall(mkdirp, path.dirname(dir));
}

throw err;
})

.then(function () {
return Q.nfcall(fs.rename, canonicalPkg, dir);
});
}.bind(this))
.then(function () {
var pkgVersion = pkgMeta.version || '_unversioned';
var versions = this._versions[sourceId];
var inCache;

if (versions) {


inCache = versions.some(function (version) {
return pkgVersion === version;
});



if (!inCache) {
versions.push(pkgVersion);
this._sortVersions(versions);
}
}


