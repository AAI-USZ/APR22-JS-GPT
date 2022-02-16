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
var copy = require('../util/copy');

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
return Q.nfcall(fs.rename, canonicalDir, dir)
.fail(function (err) {


if (err.code !== 'EXDEV') {
throw err;
}

return copy.copyDir(canonicalDir, dir)
.then(function () {
return Q.nfcall(rimraf, canonicalDir);
});
});
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


return Q.nfcall(fs.readdir, this._dir)
.then(function (sourceIds) {
promises = sourceIds.map(function (sourceId) {
return Q.nfcall(fs.readdir, path.join(that._dir, sourceId))
.then(function (versions) {
versions.forEach(function (version) {
var dir = path.join(that._dir, sourceId, version);
dirs.push(dir);
});
}, function (err) {

if (err.code === 'ENOTDIR') {
return;
}

throw err;
});
});

return Q.all(promises);
})

.then(function () {
promises = dirs.map(function (dir) {
return that._readPkgMeta(dir)
.then(function (pkgMeta) {
return {
canonicalDir: dir,
pkgMeta: pkgMeta
};
}, function () {


var sourceId = path.basename(path.dirname(dir));
that._cache.del(sourceId);

return Q.nfcall(rimraf, dir);
});
});

return Q.all(promises);
})

.then(function (entries) {


entries = entries.filter(function (entry) {
return !!entry;
});

return entries.sort(function (entry1, entry2) {
var pkgMeta1 = entry1.pkgMeta;
var pkgMeta2 = entry2.pkgMeta;
var comp = pkgMeta1.name.localeCompare(pkgMeta2.name);

if (comp) {
return comp;
}

if (pkgMeta1.version && pkgMeta2.version) {
return semver.compare(pkgMeta1.version, pkgMeta2.version);
}
if (pkgMeta1.version) {
return -1;
}
if (pkgMeta2.version) {
return 1;
}

return 0;
});
});
};



ResolveCache.clearRuntimeCache = function () {





this._cache.forEach(function (cache) {
cache.reset();
});


this._cache.reset();
};



ResolveCache.prototype._getSourceId = function (source) {
return crypto.createHash('md5').update(source).digest('hex');
};


ResolveCache.prototype._readPkgMeta = function (dir) {
var filename = path.join(dir, '.bower.json');

return Q.nfcall(fs.readFile, filename)
.then(function (contents) {
return JSON.parse(contents.toString());
})
.fail(function (err) {
throw createError('Something went wrong while reading ' + filename, err.code, {
details: err.message,
data: {
json: filename
}
});
});
};

ResolveCache.prototype._getVersions = function (sourceId) {
var dir;
var versions = this._cache.get(sourceId);
var that = this;

if (versions) {
return Q.resolve([versions, true]);
}

dir = path.join(this._dir, sourceId);
return Q.nfcall(fs.readdir, dir)
.then(function (versions) {

that._sortVersions(versions);
that._cache.set(sourceId, versions);
return [versions, false];
}, function (err) {


if (err.code === 'ENOENT') {
versions = [];
that._cache.set(sourceId, versions);
return [versions, false];
}

throw err;
});
};

ResolveCache.prototype._sortVersions = function (versions) {

versions.sort(function (version1, version2) {
var validSemver1 = semver.valid(version1);
var validSemver2 = semver.valid(version2);


if (validSemver1 && validSemver2) {
return semver.rcompare(version1, version2);
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



ResolveCache._cache = new LRU({
max: 5,
maxAge: 60 * 30 * 1000
});

module.exports = ResolveCache;
