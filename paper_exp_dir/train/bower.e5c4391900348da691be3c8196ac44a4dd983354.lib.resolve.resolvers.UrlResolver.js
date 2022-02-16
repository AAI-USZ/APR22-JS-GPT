var util = require('util');
var path = require('path');
var fs = require('fs');
var request = require('request');
var Q = require('q');
var mout = require('mout');
var Resolver = require('../Resolver');
var extract = require('../../util/extract');
var createError = require('../../util/createError');
var osJunk = require('../../util/osJunk');

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
};

util.inherits(UrlResolver, Resolver);



UrlResolver.prototype._hasNew = function (pkgMeta) {
var oldCacheHeaders = pkgMeta._cacheHeaders || {},
reqHeaders = {};



if (oldCacheHeaders.ETag) {
reqHeaders['If-None-Match'] = oldCacheHeaders.ETag;
}


return Q.nfcall(request.head, this._source, {
proxy: this._config.proxy,
timeout: 5000,
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

if (this._target !== '*') {
return Q.reject(createError('URL sources can\'t resolve targets', 'ENORESTARGET'));
}

return this._download()
.spread(this._parseHeaders.bind(this))
