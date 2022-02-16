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



UrlResolver.prototype._parseSourceURL = function (_url) {
return url.parse(path.basename(_url)).pathname;
};

UrlResolver.prototype._download = function () {
var fileName = this._parseSourceURL(this._source);

if (!fileName) {
this._source = this._source.replace(/\/(?=\?|#)/, '');
fileName = this._parseSourceURL(this._source);
