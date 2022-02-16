var util = require('util');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var Resolver = require('../Resolver');
var copy = require('../../util/copy');
var extract = require('../../util/extract');
var createError = require('../../util/createError');

var FsResolver = function (source, options) {
    // Ensure absolute path
    source = path.resolve(source);

    Resolver.call(this, source, options);
};

util.inherits(FsResolver, Resolver);
mout.object.mixIn(FsResolver, Resolver);

// -----------------

FsResolver.prototype.hasNew = function (canonicalPkg) {
    // If target was specified, simply reject the promise
    if (this._target !== '*') {
        return Q.reject(createError('File system sources can\'t resolve targets', 'ENORESTARGET'));
    }

    // TODO: should we store latest mtimes in the resolution and compare?
    //       this would be beneficial when copying big files/folders
    return Q.resolve(true);
};

FsResolver.prototype._resolveSelf = function () {
    // If target was specified, simply reject the promise
    if (this._target !== '*') {
        return Q.reject(createError('File system sources can\'t resolve targets', 'ENORESTARGET'));
    }

    return this._readJson(this._source)
    .then(this._copy.bind(this))
    .then(this._extract.bind(this))
    .then(this._rename.bind(this));
};

// -----------------

FsResolver.prototype._copy = function (meta) {
    return Q.nfcall(fs.stat, this._source)
    .then(function (stat) {
        var dstFile,
            copyOpts,
            promise;

        this._sourceStat = stat;

        // Pass in the ignore to the copy options to avoid copying ignored files
        // Also, pass in the mode to avoid additional stat calls when copying
        copyOpts = {
            mode: stat.mode,
            ignore: meta.ignore
        };

        // If it's a folder
        if (stat.isDirectory()) {
            promise = copy.copyDir(this._source, this._tempDir, copyOpts);
        // Else it's a file
        } else {
            dstFile = path.join(this._tempDir, path.basename(this._source));
            promise = copy.copyFile(this._source, dstFile, copyOpts);
        }

        return promise.then(function () {
            return dstFile;
        }.bind(this));
    }.bind(this));
};

FsResolver.prototype._extract = function (file) {
    if (!file || !extract.canExtract(file)) {
        return Q.resolve();
    }

    return extract(file, this._tempDir);
};

FsResolver.prototype._rename = function () {
    // Only rename if original source was a file
    if (!this._sourceStat.isFile()) {
        return Q.resolve();
    }

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

FsResolver.prototype._savePkgMeta = function (meta) {
    // TODO: store mtime into the package meta

    // Store main if is a single file
    if (this._singleFile) {
        meta.main = this._singleFile;
    }

    return Resolver.prototype._savePkgMeta.call(this, meta);
};

module.exports = FsResolver;