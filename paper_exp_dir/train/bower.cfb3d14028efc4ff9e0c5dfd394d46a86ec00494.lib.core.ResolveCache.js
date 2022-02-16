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


return dir;
}.bind(this));
};

ResolveCache.prototype.eliminate = function (source, version) {

};

ResolveCache.prototype.empty = function (source) {

};



ResolveCache.prototype._getSourceId = function (source) {
return crypto.createHash('md5').update(source).digest('hex');
};


ResolveCache.prototype._readPkgMeta = function (dir) {
return Q.nfcall(fs.readFile, path.join(dir, '.bower.json'))
.then(function (contents) {
return JSON.parse(contents.toString());
});
};

ResolveCache.prototype._getVersions = function (source) {
var dir;
var sourceId = this._getSourceId(source);
var cache = this._versions[sourceId];

if (cache) {
return Q.resolve(cache);
}

dir = path.join(this._dir, sourceId);
return Q.nfcall(fs.readdir, dir)
.then(function (versions) {

if (!versions.length) {
return versions;
}


this._sortVersions(versions);
return this._versions[sourceId] = versions;
}.bind(this), function (err) {


if (err.code === 'ENOENT') {
return this._versions[sourceId] = [];
}

throw err;
}.bind(this));
};

ResolveCache.prototype._sortVersions = function (versions) {
versions.sort(function (version1, version2) {
var validSemver1 = semver.valid(version1) != null;
var validSemver2 = semver.valid(version2) != null;


if (validSemver1 && validSemver2) {
if (semver.gt(version1, version2)) {
return -1;
}
if (semver.lt(version1, version2)) {
return 1;
}
return 0;
}


if (validSemver1) {
return -1;
}
if (validSemver2) {
return 1;
}


return 0;
});
};

module.exports = ResolveCache;
