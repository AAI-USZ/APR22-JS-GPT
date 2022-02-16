var fs = require('fs');
var path = require('path');
var Q = require('q');
var tmp = require('tmp');
var mkdirp = require('mkdirp');
var bowerJson = require('bower-json');
var pathspec = require('pathspec');
var rimraf = require('rimraf');
var glob = require('glob');
var config = require('../config');
var createError = require('../util/createError');

tmp.setGracefulCleanup();

var Resolver = function (source, options) {
options = options || {};

this._source = source;
this._target = options.target || '*';
this._name = options.name || path.basename(this._source);
this._guessedName = !options.name;
this._config = options.config || config;
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

Resolver.prototype.hasNew = function (canonicalPkg) {
return Q.resolve(true);
};

Resolver.prototype.resolve = function () {
var that = this;


return this._createTempDir()

.then(this._resolveSelf.bind(this))

.then(function () {
return that._readJson(that._tempDir);
})
.then(function (meta) {
return Q.all([

that._applyPkgMeta(meta),

that._savePkgMeta(meta)
]);
})
.then(function () {

return that._tempDir;
}, function (err) {

that._tempDir = null;
throw err;
});
};

Resolver.prototype.getPkgMeta = function () {
return this._pkgMeta;
};



Resolver.clearRuntimeCache = function () {};




Resolver.prototype._resolveSelf = function () {
throw new Error('_resolveSelf not implemented');
};



Resolver.prototype._createTempDir = function () {
var baseDir = path.join(tmp.tmpdir, 'bower');

return Q.nfcall(mkdirp, baseDir)
.then(function () {
return Q.nfcall(tmp.dir, {
template: path.join(baseDir, this._name + '-XXXXXX'),
mode: 0777 & ~process.umask(),
unsafeCleanup: true
});
}.bind(this))
.then(function (dir) {
this._tempDir = dir;
return dir;
}.bind(this));
};

Resolver.prototype._readJson = function (dir) {
var deferred = Q.defer();

Q.nfcall(bowerJson.find, dir)
.then(function (filename) {

if (path.basename(filename) === 'component.json') {
deferred.notify({
type: 'warn',
data: 'Package "' + this._name + '" is using the deprecated component.json file'
});
}


return Q.nfcall(bowerJson.read, filename)
.then(null, function (err) {
throw createError('Something went wrong while reading "' + filename + '"', err.code, {
details: err.message
});
});
}.bind(this), function () {

return Q.nfcall(bowerJson.parse, { name: this._name });
}.bind(this))
.then(deferred.resolve, deferred.reject, deferred.notify);

return deferred.promise;
};

Resolver.prototype._applyPkgMeta = function (meta) {

if (meta.name !== this._name) {

if (this._guessedName) {
this._name = meta.name;

} else {
meta.name = this._name;
}
}


if (meta.ignore && meta.ignore.length) {
return Q.nfcall(glob, '**/*', { cwd: this._tempDir, dot: true, mark: true })
.then(function (files) {
var promises = [];


return Q.all(promises);
}.bind(this))
.then(function () {
return meta;
});
}

return Q.resolve(meta);
};
