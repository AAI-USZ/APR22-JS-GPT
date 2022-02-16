var crypto = require('crypto');
var fs = require('graceful-fs');
var path = require('path');
var semver = require('semver');
var mout = require('mout');
var Q = require('q');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var LRU = require('lru-cache');
var createError = require('../util/createError');

function ResolveCache(config) {





this._config = config;
this._dir = this._config.storage.packages;



this._cache = this.constructor._cache.get(this._dir);
if (!this._cache) {
this._cache = new LRU({
max: 100,
maxAge: 60 * 30 * 1000
});
this.constructor._cache.set(this._dir, this._cache);
}


mkdirp.sync(this._dir);
}



ResolveCache.prototype.retrieve = function (source, target) {
var sourceId = this._getSourceId(source);
var dir = path.join(this._dir, sourceId);
var that = this;

target = target || '*';

return this._getVersions(sourceId)
.spread(function (versions) {
var suitable;


if (semver.validRange(target)) {
suitable = mout.array.find(versions, function (version) {
return semver.valid(version) &&
semver.satisfies(version, target);
});

if (suitable) {
return suitable;
}
}


if (target === '*') {
return mout.array.find(versions, function (version) {
return version === '_wildcard';
});
}


return mout.array.find(versions, function (version) {
return version === target;
});
})
.then(function (version) {
var canonicalDir;

if (!version) {
return [];
}


canonicalDir = path.join(dir, version);
return that._readPkgMeta(canonicalDir)
.then(function (pkgMeta) {
return [canonicalDir, pkgMeta];
}, function () {


that._cache.del(sourceId);

return Q.nfcall(rimraf, canonicalDir)
.then(function () {
return that.retrieve(source, target);
});
});
});
};

ResolveCache.prototype.versions = function (source) {
var sourceId = this._getSourceId(source);

return this._getVersions(sourceId)
.spread(function (versions) {
return versions.filter(function (version) {
return semver.valid(version);
});
});
};

ResolveCache.prototype.store = function (canonicalDir, pkgMeta) {
var sourceId;
var release;
var dir;
var promise;
var that = this;

promise = pkgMeta ? Q.resolve(pkgMeta) : this._readPkgMeta(canonicalDir);

return promise
.then(function (pkgMeta) {
release = pkgMeta.version || (pkgMeta._target === '*' ? '_wildcard' : pkgMeta._target);
sourceId = that._getSourceId(pkgMeta._source);
dir = path.join(that._dir, sourceId, release);


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
return Q.nfcall(fs.rename, canonicalDir, dir);
});
})
.then(function () {
var versions = that._cache.get(sourceId);



if (versions && versions.indexOf(release) === -1) {
versions.push(release);
that._sortVersions(versions);
}


return dir;
});
};

ResolveCache.prototype.eliminate = function (pkgMeta) {
var sourceId = this._getSourceId(pkgMeta._source);
var version = pkgMeta.version || '_wildcard';
var dir = path.join(this._dir, sourceId, version);
var that = this;

return Q.nfcall(rimraf, dir)
.then(function () {
var versions = that._cache.get(sourceId) || [];
mout.array.remove(versions, version);





if (!versions.length) {
that._cache.del(sourceId);

return that._getVersions(sourceId)
.spread(function (versions) {
if (!versions.length) {
return Q.nfcall(rimraf, path.dirname(dir));
}
});
}
});
};

ResolveCache.prototype.clear = function () {
return Q.nfcall(rimraf, this._dir)
.then(function () {
this._cache.reset();
}.bind(this));
};

ResolveCache.prototype.reset = function () {
this._cache.reset();
};

ResolveCache.prototype.list = function () {
var promises;
var dirs = [];
var that = this;

