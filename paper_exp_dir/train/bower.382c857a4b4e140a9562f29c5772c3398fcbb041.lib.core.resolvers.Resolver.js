var fs = require('fs');
var path = require('path');
var Q = require('q');
var tmp = require('tmp');
var mkdirp = require('mkdirp');
var bowerJson = require('bower-json');
var defaultConfig = require('../../config');
var createError = require('../../util/createError');
var removeIgnores = require('../../util/removeIgnores');

tmp.setGracefulCleanup();

var Resolver = function (source, options) {
options = options || {};

this._source = source;
this._target = options.target || '*';
this._name = options.name || path.basename(this._source);
this._guessedName = !options.name;
this._config = options.config || defaultConfig;
};



Resolver.prototype.getSource = function () {
return this._source;
};

Resolver.prototype.getName = function () {
return this._name;
};

Resolver.prototype.getTarget = function () {
return this._target;
};

Resolver.prototype.getTempDir = function () {
return this._tempDir;
};

Resolver.prototype.hasNew = function (canonicalPkg, pkgMeta) {
var promise;
var metaFile;
var that = this;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

this._working = true;


if (pkgMeta) {
promise = this._hasNew(canonicalPkg, pkgMeta);

} else {
metaFile = path.join(canonicalPkg, '.bower.json');
promise = Q.nfcall(fs.readFile, metaFile)
.then(function (contents) {
var pkgMeta = JSON.parse(contents.toString());
return that._hasNew(canonicalPkg, pkgMeta);
}, function () {
return true;
});
}

return promise.fin(function () {
that._working = false;
});
};

Resolver.prototype.resolve = function () {
var that = this;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

this._working = true;


return this._createTempDir()

.then(this._resolve.bind(this))

.then(this._readJson.bind(this, this._tempDir))
.then(function (meta) {
return Q.all([

that._applyPkgMeta(meta),

that._savePkgMeta(meta)
]);
})
.then(function () {

