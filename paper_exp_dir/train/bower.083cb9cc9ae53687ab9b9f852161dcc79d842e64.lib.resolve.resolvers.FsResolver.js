var util = require('util');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var Resolver = require('../Resolver');
var copy = require('../../util/copy');
var extract = require('../../util/extract');
var createError = require('../../util/createError');
var junk = require('junk');

var FsResolver = function (source, options) {
Resolver.call(this, source, options);


this._source = path.resolve(this._config.cwd, source);


if (this._target !== '*') {
throw createError('File system sources can\'t resolve targets', 'ENORESTARGET');
}
};

util.inherits(FsResolver, Resolver);
mout.object.mixIn(FsResolver, Resolver);









FsResolver.prototype._resolve = function () {
return this._readJson(this._source)
.then(this._copy.bind(this))
.then(this._extract.bind(this))
.then(this._rename.bind(this));
};



FsResolver.prototype._copy = function (meta) {
return Q.nfcall(fs.stat, this._source)
.then(function (stat) {
var dstFile;
var copyOpts;
var promise;

this._sourceStat = stat;



copyOpts = {
mode: stat.mode,
ignore: meta.ignore
};


if (stat.isDirectory()) {
promise = copy.copyDir(this._source, this._tempDir, copyOpts);

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

FsResolver.prototype._savePkgMeta = function (meta) {

if (this._singleFile) {
meta.main = this._singleFile;
}

return Resolver.prototype._savePkgMeta.call(this, meta);
};

module.exports = FsResolver;
