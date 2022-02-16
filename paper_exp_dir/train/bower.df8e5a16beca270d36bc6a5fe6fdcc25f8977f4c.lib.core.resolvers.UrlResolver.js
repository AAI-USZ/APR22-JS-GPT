var util = require('util');
var path = require('path');
var fs = require('../../util/fs');
var url = require('url');
var request = require('request');
var Q = require('q');
var mout = require('mout');
var junk = require('junk');
var Resolver = require('./Resolver');
var download = require('../../util/download');
var extract = require('../../util/extract');
var createError = require('../../util/createError');

function UrlResolver(decEndpoint, config, logger) {
Resolver.call(this, decEndpoint, config, logger);


if (this._target !== '*') {
throw createError('URL sources can\'t resolve targets', 'ENORESTARGET');
}


if (this._guessedName) {

this._name = this._name.replace(/\?.*$/, '');

this._name = this._name.substr(0, this._name.length - path.extname(this._name).length);
}

this._remote = url.parse(this._source);
}

util.inherits(UrlResolver, Resolver);
mout.object.mixIn(UrlResolver, Resolver);



UrlResolver.isTargetable = function () {
return false;
};

UrlResolver.prototype._hasNew = function (pkgMeta) {
var oldCacheHeaders = pkgMeta._cacheHeaders || {};
var reqHeaders = {};



if (oldCacheHeaders.ETag) {
reqHeaders['If-None-Match'] = oldCacheHeaders.ETag;
}

if (this._config.userAgent) {
reqHeaders['User-Agent'] = this._config.userAgent;
}


return Q.nfcall(request.head, this._source, {
ca: this._config.ca.default,
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
var fileName = url.parse(path.basename(this._source)).pathname;
var file = path.join(this._tempDir, fileName);
var reqHeaders = {};
var that = this;

if (this._config.userAgent) {
reqHeaders['User-Agent'] = this._config.userAgent;
}

this._logger.action('download', that._source, {
url: that._source,
to: file
});


return download(this._source, file, {
ca: this._config.ca.default,
strictSSL: this._config.strictSsl,
timeout: this._config.timeout,
headers: reqHeaders
})
.progress(function (state) {
var msg;


if (state.retry) {
msg = 'Download of ' + that._source + ' failed' + (state.error.code ? ' with ' + state.error.code : '') + ', ';
msg += 'retrying in ' + (state.delay / 1000).toFixed(1) + 's';
that._logger.debug('error', state.error.message, { error: state.error });
return that._logger.warn('retry', msg);
}


msg = 'received ' + (state.received / 1024 / 1024).toFixed(1) + 'MB';
if (state.total) {
msg += ' of ' + (state.total / 1024 / 1024).toFixed(1) + 'MB downloaded, ';
msg += state.percent + '%';
}
that._logger.info('progress', msg);
})
.then(function (response) {
that._response = response;
return [file, response];
});
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

mimeType = mout.string.trim(mimeType, ['"', '\'']);
}

if (!extract.canExtract(file, mimeType)) {
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


if (files.length === 1 && !/^(component|bower)\.json$/.test(files[0])) {
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
