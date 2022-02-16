var fs = require('graceful-fs');
var path = require('path');
var Q = require('q');
var tmp = require('tmp');
var mkdirp = require('mkdirp');
var readJson = require('../../util/readJson');
var createError = require('../../util/createError');
var removeIgnores = require('../../util/removeIgnores');

tmp.setGracefulCleanup();

function Resolver(decEndpoint, config, logger) {
this._source = decEndpoint.source;
this._target = decEndpoint.target || '*';
this._name = decEndpoint.name || path.basename(this._source);

this._config = config;
this._logger = logger;

this._guessedName = !decEndpoint.name;
}



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

Resolver.prototype.getPkgMeta = function () {
return this._pkgMeta;
};

Resolver.prototype.hasNew = function (canonicalDir, pkgMeta) {
var promise;
var metaFile;
var that = this;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

this._working = true;


if (pkgMeta) {
promise = this._hasNew(canonicalDir, pkgMeta);

} else {
metaFile = path.join(canonicalDir, '.bower.json');

promise = readJson(metaFile)
.spread(function (pkgMeta) {
return that._hasNew(canonicalDir, pkgMeta);
}, function (err) {
that._logger.debug('read-json', 'Failed to read ' + metaFile, {
filename: metaFile,
error: err
});

return true;
