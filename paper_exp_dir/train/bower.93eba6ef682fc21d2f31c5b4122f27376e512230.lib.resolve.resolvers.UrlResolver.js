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
timeout: 5000
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
var file = path.join(this._tempDir, this._name),
deferred = Q.defer(),
req,
res,
writer,
finish,
that = this;

finish = function (err) {

req.removeAllListeners();
writer.removeAllListeners();


if (err) {
return deferred.reject(err);
} else {
that._response = res;
return deferred.resolve([file, res]);
}
};


req = request(this._source, {
proxy: this._config.proxy,
timeout: 5000
})
.on('response', function (response) {
res = response;
})
.on('error', finish);


writer = fs.createWriteStream(file)
.on('error', finish)
.on('close', finish);


req.pipe(writer);

return deferred.promise;
};

UrlResolver.prototype._parseHeaders = function (file, response) {
var disposition,
newFile,
matches;


disposition = response.headers['content-disposition'];
if (!disposition) {
return Q.resolve([file, response]);
}







matches = disposition.match(/filename="?([\w\.\-](?:[\w\.\- ]*[\w\-]))"?/i);
if (!matches) {
return Q.resolve([file, response]);
}


