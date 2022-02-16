var util = require('util');
var path = require('path');
var fs = require('fs');
var request = require('request');
var Q = require('q');
var mout = require('mout');
var Resolver = require('../Resolver');
var extract = require('../../util/extract');
var createError = require('../../util/createError');

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
};

util.inherits(UrlResolver, Resolver);

// -----------------

UrlResolver.prototype._hasNew = function (pkgMeta) {
    var oldHeaders = pkgMeta._cacheHeaders || {};

    // TODO: switch from HEAD request to normal + abort

    // Make a HEAD request to the source
    return Q.nfcall(request.head, this._source, {
        proxy: this._config.proxy,
        timeout: 5000
    })
    // Compare new headers with the old ones
    .then(function (response) {
        var headers = this._collectCacheHeaders(response);
        return mout.object.equals(oldHeaders, headers);
    }.bind(this), function () {
        // Assume new contents if the request failed
        return true;
    });
};

UrlResolver.prototype._resolve = function () {
    // If target was specified, simply reject the promise
    if (this._target !== '*') {
        return Q.reject(createError('URL sources can\'t resolve targets', 'ENORESTARGET'));
    }

    return this._download()
    .then(this._parseHeaders.bind(this))
    .then(this._extract.bind(this))
    .then(this._rename.bind(this));
};

// -----------------

UrlResolver.prototype._download = function () {
    var file = path.join(this._tempDir, this._name),
        deferred = Q.defer(),
        req,
        res,
        writer,
        finish;

    finish = function (err) {
        // Ensure that all listeners are removed
        req.removeAllListeners();
        writer.removeAllListeners();

        // If we got an error, simply reject the deferred
        if (err) {
            return deferred.reject(err);
        } else {
            this._response = res;
            return deferred.resolve([file, res]);
        }
    };

    // Make the request to the source
    req = request(this._source, {
        proxy: this._config.proxy,
        timeout: 5000
    })
    .on('response', function (response) {
        res = response;
    })
    .on('error', finish);

    // Create a write stream to the end file
    writer = fs.createWriteStream(file)
    .on('error', finish)
    .on('close', finish);

    // Pipe request response to writer
    req.pipe(writer);

    return deferred.promise;
};

UrlResolver.prototype._parseHeaders = function (file, response) {
    var disposition,
        newFile,
        matches;

    // Check if we got a Content-Disposition header
    disposition = response.get('Content-Disposition');
    if (!disposition) {
        return Q.resolve([file, response]);
    }

    // If so, extract the filename
    matches = disposition.match(/filename="?(.+?)"?/i);
    if (!matches) {
        return Q.resolve([file, response]);
    }

    // Rename our downloaded file
    newFile = path.join(this._tempDir, matches[1]);

    return Q.nfcall(fs.rename, file, newFile)
    .then(function () {
        return [newFile, response];
    });
};

UrlResolver.prototype._extract = function (file, response) {
    var mimeType = response.getHeader('Content-Type');

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
        var file,
            oldPath,
            newPath;

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
        var value = res.getHeader(name);

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