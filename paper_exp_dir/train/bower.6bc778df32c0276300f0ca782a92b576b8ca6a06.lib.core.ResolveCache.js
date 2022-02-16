var fs = require('../util/fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var mkdirp = require('mkdirp');
var rimraf = require('../util/rimraf');
var LRU = require('lru-cache');
var lockFile = require('lockfile');
var md5 = require('md5-hex');
var semver = require('../util/semver');
var readJson = require('../util/readJson');
var copy = require('../util/copy');

function ResolveCache(config) {





this._config = config;
this._dir = this._config.storage.packages;
this._lockDir = this._config.storage.packages;

mkdirp.sync(this._lockDir);



this._cache = this.constructor._cache.get(this._dir);
if (!this._cache) {
this._cache = new LRU({
max: 100,
maxAge: 60 * 5 * 1000
});
this.constructor._cache.set(this._dir, this._cache);
}


mkdirp.sync(this._dir);
}



ResolveCache.prototype.retrieve = function(source, target) {
var sourceId = md5(source);
var dir = path.join(this._dir, sourceId);
var that = this;

target = target || '*';

return this._getVersions(sourceId)
.spread(function(versions) {
var suitable;


if (semver.validRange(target)) {
suitable = semver.maxSatisfying(versions, target, true);

if (suitable) {
return suitable;
}
}


if (target === '*') {
return mout.array.find(versions, function(version) {
return version === '_wildcard';
});
}


return mout.array.find(versions, function(version) {
return version === target;
});
})
.then(function(version) {
var canonicalDir;

if (!version) {
return [];
}


canonicalDir = path.join(dir, encodeURIComponent(version));
return that._readPkgMeta(canonicalDir).then(
function(pkgMeta) {
return [canonicalDir, pkgMeta];
},
function() {


