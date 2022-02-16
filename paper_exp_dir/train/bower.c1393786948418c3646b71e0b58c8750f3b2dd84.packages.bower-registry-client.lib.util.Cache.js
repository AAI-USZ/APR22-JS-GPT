var fs = require('graceful-fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var LRU = require('lru-cache');

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

Cache.prototype.get = function (key, callback) {
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
fs.readFile(file, function (err, contents) {
var json;




if (err) {
return callback(err.code === 'ENOENT' ? null : err);
}



try {
json = JSON.parse(contents.toString());
} catch (e) {
return this.del(key, callback);
}


if (this._hasExpired(json)) {
return this.del(key, callback);
}

this._cache.set(key, json);
callback(null, json.value);
}.bind(this));
};

Cache.prototype.set = function (key, value, maxAge, callback) {
var file;
var entry;
var str;

maxAge = maxAge != null ? maxAge : this._options.maxAge;
entry = {
expires: maxAge ? Date.now() + maxAge : null,
value: value
};


this._cache.set(key, entry);


if (!this._dir) {
return callback(null);
}



try {
str = JSON.stringify(entry);
} catch (e) {
return callback(e);
}

file = this._getFile(key);
fs.writeFile(file, str, callback);
};

Cache.prototype.del = function (key, callback) {

this._cache.del(key);


if (!this._dir) {
return callback(null);
}

fs.unlink(this._getFile(key), function (err) {
if (err && err.code !== 'ENOENT') {
return callback(err);
}

callback();
});
};

Cache.prototype.clear = function (callback) {
var dir = this._dir;


this._cache.reset();


if (!dir) {
return callback(null);
}

fs.readdir(dir, function (err, files) {
if (err) {
return callback(err);
}


async.forEach(files, function (file, next) {
fs.unlink(path.join(dir, file), function (err) {
if (err && err.code !== 'ENOENT') {
return next(err);
}

next();
});
}, callback);
});
};

Cache.prototype.reset = function (callback) {
this._cache.reset();
};

Cache.clearRuntimeCache = function () {



this._cache.reset();
};



Cache.prototype._hasExpired = function (json) {
var expires = json.expires;

if (!expires || this._options.useStale) {
