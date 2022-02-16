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

    // If target was specified, error out
    if (this._target !== '*') {
        throw createError('URL sources can\'t resolve targets', 'ENORESTARGET');
    }

    // If the name was guessed, remove the ? part
    if (this._guessedName) {
        pos = this._name.indexOf('?');
        if (pos !== -1) {
            this._name = path.basename(this._name.substr(0, pos));
        }
    }

    this._remote = url.parse(source);
};

util.inherits(UrlResolver, Resolver);

// -----------------

UrlResolver.prototype._hasNew = function (canonicalPkg, pkgMeta) {
    var oldCacheHeaders = pkgMeta._cacheHeaders || {};
    var reqHeaders = {};

    // If the previous cache headers contain an ETag,
    // send the "If-None-Match" header with it
    if (oldCacheHeaders.ETag) {
        reqHeaders['If-None-Match'] = oldCacheHeaders.ETag;
    }

    if (this._config.userAgent) {
        reqHeaders['User-Agent'] = this._config.userAgent;
    }

    // Make an HEAD request to the source
    return Q.nfcall(request.head, this._source, {
        proxy: this._remote.protocol === 'https:' ? this._config.httpsProxy : this._config.proxy,
        strictSSL: this._config.strictSsl,
        timeout: 5000,
        headers: reqHeaders,
        agent: false                 // Do not use keep alive, solves #437
    })
    // Compare new headers with the old ones
    .spread(function (response) {
        var cacheHeaders;

        // If the server responded with 303 then the resource
        // still has the same ETag
        if (response.statusCode === 304) {
            return false;
        }

        // If status code is not in the 2xx range,
        // then just resolve to true
        if (response.statusCode < 200 || response.statusCode >= 300) {
            return true;
        }

        // Fallback to comparing cache headers
        cacheHeaders = this._collectCacheHeaders(response);
        return !mout.object.equals(oldCacheHeaders, cacheHeaders);
    }.bind(this), function () {
        // Assume new contents if the request failed
        return true;
    });
};

// TODO: there's room for improvement by using streams if the url
//       is an archive file, by piping read stream to the zip extractor
//       this will likely increase the complexity of code but might worth it

UrlResolver.prototype._resolve = function () {
    // Download
    return this._download()
    // Parse headers
    .spread(this._parseHeaders.bind(this))
    // Extract file
    .spread(function (file, response) {
        return this._extract(file, response)
        .progress(function (notification) {
            return notification;
        });
    }.bind(this))
    // Rename file to index
    .then(this._rename.bind(this));
};

// -----------------

UrlResolver.prototype._download = function () {
    var file = path.join(this._tempDir, path.basename(this._source));
    var reqHeaders = {};
    var that = this;
    var deferred = Q.defer();

    if (this._config.userAgent) {
        reqHeaders['User-Agent'] = this._config.userAgent;
    }

    process.nextTick(function () {
        deferred.notify({
            level: 'action',
            tag: 'download',
            data: that._source,
            url: that._source
        });
    });

    // Download the file
    request(this._source, {
        proxy: this._remote.protocol === 'https:' ? this._config.httpsProxy : this._config.proxy,
        strictSSL: this._config.strictSsl,
        timeout: 5000,
        headers: reqHeaders,
        agent: false                 // Do not use keep alive, solves #437
    })
    .on('response', function (response) {
        that._response = response;
    })
    .on('error', deferred.reject)
    // Pipe read stream to write stream
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

    // Check if we got a Content-Disposition header
    disposition = response.headers['content-disposition'];
    if (!disposition) {
        return Q.resolve([file, response]);
    }

    // Since there's various security issues with parsing this header, we only
    // interpret word chars plus dots, dashes and spaces
    match = disposition.match(/filename=(?:"([\w\-\. ]+)")/i);
    if (!match) {
        // The spec defines that the filename must be in quotes,
        // though a wide range of servers do not follow the rule
        match = disposition.match(/filename=([\w\-\.]+)/i);
        if (!match) {
            return Q.resolve([file, response]);
        }
    }

    // Trim spaces
    newFile = match[1].trim();

    // The filename can't end with a dot because this is known
    // to cause issues in Windows
    // See: http://superuser.com/questions/230385/dots-at-end-of-file-name
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
    var deferred;

    if (mimeType) {
        // Clean everything after ; and trim the end result
        mimeType = mimeType.split(';')[0].trim();
    }

    if (!extract.canExtract(mimeType || file)) {
        return Q.resolve();
    }

    deferred = Q.defer();

    process.nextTick(function () {
        deferred.notify({
            level: 'action',
            tag: 'extract',
            data: path.basename(file),
            file: file
        });
    });

    extract(file, this._tempDir, {
        mimeType: mimeType
    })
    .then(deferred.resolve, deferred.reject, deferred.notify);

    return deferred.promise;
};

UrlResolver.prototype._rename = function () {
    return Q.nfcall(fs.readdir, this._tempDir)
    .then(function (files) {
        var file;
        var oldPath;
        var newPath;

        // Remove any OS specific files from the files array
        // before checking its length
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
    // Store collected headers in the package meta
    meta._cacheHeaders = this._collectCacheHeaders(this._response);

    // Store ETAG under _release
    if (meta._cacheHeaders.ETag) {
        meta._release = 'e-tag:' + mout.string.trim(meta._cacheHeaders.ETag.substr(0, 10), '"');
    }

    // Store main if is a single file
    if (this._singleFile) {
        meta.main = this._singleFile;
    }

    return Resolver.prototype._savePkgMeta.call(this, meta);
};

UrlResolver.prototype._collectCacheHeaders = function (res) {
    var headers = {};

    // Collect cache headers
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
