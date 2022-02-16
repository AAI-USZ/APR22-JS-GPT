var fs = require('graceful-fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var LRU = require('lru-cache');
var semver = require('../util/semver');
var readJson = require('../util/readJson');
var copy = require('../util/copy');
var md5 = require('../util/md5');

function ResolveCache(config) {





this._config = config;
this._dir = this._config.storage.packages;



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



ResolveCache.prototype.retrieve = function (source, target) {
var sourceId = md5(source);
var dir = path.join(this._dir, sourceId);
var that = this;

target = target || '*';

return this._getVersions(sourceId)
.spread(function (versions) {
var suitable;


if (semver.validRange(target)) {
suitable = semver.maxSatisfying(versions, target, true);

if (suitable) {
return suitable;
