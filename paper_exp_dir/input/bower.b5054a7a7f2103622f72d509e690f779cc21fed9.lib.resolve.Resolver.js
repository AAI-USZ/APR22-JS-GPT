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



