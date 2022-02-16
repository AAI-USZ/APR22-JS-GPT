var util = require('util');
var path = require('path');
var fs = require('graceful-fs');
var url = require('url');
var request = require('request');
var Q = require('q');
var mout = require('mout');
var junk = require('junk');
var progress = require('request-progress');
var replay = require('request-replay');
var Resolver = require('./Resolver');
var extract = require('../../util/extract');
var createError = require('../../util/createError');

function UrlResolver(decEndpoint, config, logger) {
var pos;

Resolver.call(this, decEndpoint, config, logger);


if (this._target !== '*') {
throw createError('URL sources can\'t resolve targets', 'ENORESTARGET');
}


if (this._guessedName) {
pos = this._name.indexOf('?');
if (pos !== -1) {
this._name = path.basename(this._name.substr(0, pos));
}
}

this._remote = url.parse(this._source);
}

util.inherits(UrlResolver, Resolver);
mout.object.mixIn(UrlResolver, Resolver);



UrlResolver.isTargetable = function () {
return false;
};

UrlResolver.prototype._hasNew = function (canonicalDir, pkgMeta) {
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
timeout: this._config.timeout,
headers: reqHeaders
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

return this._download()

.spread(this._parseHeaders.bind(this))

.spread(this._extract.bind(this))

.then(this._rename.bind(this));
};



UrlResolver.prototype._download = function () {
var file = path.join(this._tempDir, path.basename(this._source));
var reqHeaders = {};
var that = this;
var deferred = Q.defer();

if (this._config.userAgent) {
reqHeaders['User-Agent'] = this._config.userAgent;
}

this._logger.action('download', that._source, {
url: that._source,
to: file
});


replay(progress(request(this._source, {
proxy: this._remote.protocol === 'https:' ? this._config.httpsProxy : this._config.proxy,
strictSSL: this._config.strictSsl,
timeout: this._config.timeout,
headers: reqHeaders
}), {
delay: 8000
}))
.on('response', function (response) {
var status = response.statusCode;

if (status < 200 || status > 300) {
deferred.reject(createError('Status code of ' + status, 'EHTTP'));
}

that._response = response;
})
.on('progress', function (state) {
var totalMb = Math.round(state.total / 1024 / 1024);
var receivedMb = Math.round(state.received / 1024 / 1024);

that._logger.info('progress', receivedMb + 'MB of ' + totalMb + 'MB downloaded, ' + state.percent + '%');
})
.on('replay', function (nr, error) {
that._logger.debug('retry', 'Retrying request to ' + this._source + ' because it failed with ' + error.code);
})
.on('error', deferred.reject)

.pipe(fs.createWriteStream(file))
.on('error', deferred.reject)
.on('close', function () {
deferred.resolve([file, that._response]);
});

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

this._logger.action('extract', path.basename(this._source), {
archive: file,
to: this._tempDir
});

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
