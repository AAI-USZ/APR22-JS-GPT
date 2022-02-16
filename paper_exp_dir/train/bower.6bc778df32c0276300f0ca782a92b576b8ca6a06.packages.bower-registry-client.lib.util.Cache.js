var fs = require('graceful-fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var LRU = require('lru-cache');
var md5 = require('./md5');

function Cache(dir, options) {
options = options || {};

this._dir = dir;
this._options = options;
this._cache = this.constructor._cache.get(this._dir);

if (!this._cache) {
this._cache = new LRU(options);
this.constructor._cache.set(this._dir, this._cache);
}

if (dir) {
mkdirp.sync(dir);
}
}

Cache.prototype.get = function(key, callback) {
var file;
var json = this._cache.get(key);


if (json) {
if (this._hasExpired(json)) {
this.del(key, callback);
} else {
callback(null, json.value);
}

return;
}


if (!this._dir) {
return callback(null);
}

file = this._getFile(key);
fs.readFile(
file,
function(err, contents) {
var json;




if (err) {
return callback(err.code === 'ENOENT' ? null : err);
}
