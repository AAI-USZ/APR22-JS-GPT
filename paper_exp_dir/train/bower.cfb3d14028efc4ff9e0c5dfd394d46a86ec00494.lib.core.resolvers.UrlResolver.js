var util = require('util');
var path = require('path');
var fs = require('fs');
var url = require('url');
var request = require('request');
var Q = require('q');
var mout = require('mout');
var Resolver = require('./Resolver');
var extract = require('../../util/extract');
var createError = require('../../util/createError');
var junk = require('junk');

var UrlResolver = function (source, options) {
var pos;

Resolver.call(this, source, options);


if (this._target !== '*') {
throw createError('URL sources can\'t resolve targets', 'ENORESTARGET');
}


if (this._guessedName) {
pos = this._name.indexOf('?');
if (pos !== -1) {
this._name = path.basename(this._name.substr(0, pos));
}
}

this._remote = url.parse(source);
};

util.inherits(UrlResolver, Resolver);



UrlResolver.prototype._hasNew = function (canonicalPkg, pkgMeta) {
var oldCacheHeaders = pkgMeta._cacheHeaders || {};
var reqHeaders = {};



if (oldCacheHeaders.ETag) {
reqHeaders['If-None-Match'] = oldCacheHeaders.ETag;
}

if (this._config.userAgent) {
reqHeaders['User-Agent'] = this._config.userAgent;
}


return Q.nfcall(request.head, this._source, {
proxy: this._remote.protocol === 'https:' ? this._config.httpsProxy : this._config.proxy,
strictSSL: this._config.strictSsl,
timeout: 5000,
headers: reqHeaders,
agent: false
})

.spread(function (response) {
var cacheHeaders;



if (response.statusCode === 304) {
return false;
}



if (response.statusCode < 200 || response.statusCode >= 300) {
return true;
}


cacheHeaders = this._collectCacheHeaders(response);
return !mout.object.equals(oldCacheHeaders, cacheHeaders);
}.bind(this), function () {

return true;
});
};





UrlResolver.prototype._resolve = function () {

if (this._target !== '*') {
return Q.reject(createError('URL sources can\'t resolve targets', 'ENORESTARGET'));
}

return this._download()
.spread(this._parseHeaders.bind(this))
.spread(this._extract.bind(this))
.then(this._rename.bind(this));
};



UrlResolver.prototype._download = function () {
var file = path.join(this._tempDir, path.basename(this._source));
var deferred = Q.defer();
var reqHeaders = {};

if (this._config.userAgent) {
reqHeaders['User-Agent'] = this._config.userAgent;
}


request(this._source, {
proxy: this._remote.protocol === 'https:' ? this._config.httpsProxy : this._config.proxy,
strictSSL: this._config.strictSsl,
timeout: 5000,
headers: reqHeaders,
agent: false
})
.on('response', function (response) {
this._response = response;
}.bind(this))
.on('error', deferred.reject)

.pipe(fs.createWriteStream(file))
.on('error', deferred.reject)
.on('close', function () {
deferred.resolve([file, this._response]);
}.bind(this));

return deferred.promise;
};

UrlResolver.prototype._parseHeaders = function (file, response) {
var disposition;
var newFile;
var match;


disposition = response.headers['content-disposition'];
if (!disposition) {
return Q.resolve([file, response]);
}



match = disposition.match(/filename=(?:"([\w\-\. ]+)")/i);
if (!match) {


match = disposition.match(/filename=([\w\-\.]+)/i);
if (!match) {
return Q.resolve([file, response]);
}
}


newFile = match[1].trim();




if (mout.string.endsWith(newFile, '.')) {
return Q.resolve([file, response]);
}

newFile = path.join(this._tempDir, newFile);

return Q.nfcall(fs.rename, file, newFile)
.then(function () {
return [newFile, response];
});
};

UrlResolver.prototype._extract = function (file, response) {
var mimeType = response.headers['content-type'];

if (mimeType) {

mimeType = mimeType.split(';')[0].trim();
}

if (!extract.canExtract(mimeType || file)) {
return Q.resolve();
}

return extract(file, this._tempDir, {
mimeType: mimeType
});
};

UrlResolver.prototype._rename = function () {
return Q.nfcall(fs.readdir, this._tempDir)
.then(function (files) {
var file;
var oldPath;
var newPath;



files = files.filter(junk.isnt);

if (files.length === 1) {
file = files[0];
this._singleFile = 'index' + path.extname(file);
oldPath = path.join(this._tempDir, file);
newPath = path.join(this._tempDir, this._singleFile);

return Q.nfcall(fs.rename, oldPath, newPath);
}
}.bind(this));
};

UrlResolver.prototype._savePkgMeta = function (meta) {

meta._cacheHeaders = this._collectCacheHeaders(this._response);


if (meta._cacheHeaders.ETag) {
meta._release = 'e-tag:' + mout.string.trim(meta._cacheHeaders.ETag.substr(0, 10), '"');
}


if (this._singleFile) {
meta.main = this._singleFile;
}

return Resolver.prototype._savePkgMeta.call(this, meta);
};

UrlResolver.prototype._collectCacheHeaders = function (res) {
var headers = {};


this.constructor._cacheHeaders.forEach(function (name) {
var value = res.headers[name.toLowerCase()];

if (value != null) {
headers[name] = value;
}
});

return headers;
};

UrlResolver._cacheHeaders = [
'Content-MD5',
'ETag',
'Last-Modified',
'Content-Language',
'Content-Length',
'Content-Type',
'Content-Disposition'
];

module.exports = UrlResolver;
