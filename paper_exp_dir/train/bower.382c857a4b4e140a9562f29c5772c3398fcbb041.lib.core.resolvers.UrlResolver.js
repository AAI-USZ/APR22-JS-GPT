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

.spread(function (file, response) {
return this._extract(file, response)
.progress(function (notification) {
return notification;
});
