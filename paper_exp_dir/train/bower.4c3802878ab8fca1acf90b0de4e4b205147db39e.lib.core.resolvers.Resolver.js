var fs = require('fs');
var path = require('path');
var Q = require('q');
var tmp = require('tmp');
var mkdirp = require('mkdirp');
var bowerJson = require('bower-json');
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
promise = Q.nfcall(fs.readFile, metaFile)
.then(function (contents) {
var pkgMeta = JSON.parse(contents.toString());
return that._hasNew(canonicalDir, pkgMeta);
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

.then(this._readJson.bind(this, null))

.then(function (meta) {
return that._applyPkgMeta(meta)
.then(that._savePkgMeta.bind(that, meta));
})
.then(function () {

return that._tempDir;
}, function (err) {

that._tempDir = null;
throw err;
})
.fin(function () {
that._working = false;
});
};

Resolver.prototype.getPkgMeta = function () {
return this._pkgMeta;
};


Resolver.clearRuntimeCache = function () {};




Resolver.prototype._resolve = function () {
throw new Error('_resolve not implemented');
};

Resolver.prototype._hasNew = function (canonicalDir, pkgMeta) {
return Q.resolve(true);
};

