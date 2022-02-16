var fs = require('../../util/fs');
var path = require('path');
var Q = require('q');
var tmp = require('tmp');
var mkdirp = require('mkdirp');
var rimraf = require('../../util/rimraf');
var readJson = require('../../util/readJson');
var createError = require('../../util/createError');
var removeIgnores = require('../../util/removeIgnores');
var md5 = require('md5-hex');

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

Resolver.prototype.hasNew = function (pkgMeta) {
var promise;
var that = this;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}

this._working = true;


promise = this._hasNew(pkgMeta);

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

Resolver.prototype.isCacheable = function () {

if (this._source &&
/^(?:file:[\/\\]{2}|[A-Z]:)?\.?\.?[\/\\]/.test(this._source)
) {
return false;
}


if (this._pkgMeta &&
this._pkgMeta._resolution &&
this._pkgMeta._resolution.type === 'branch') {
return false;
}

return true;
};





Resolver.prototype._resolve = function () {
throw new Error('_resolve not implemented');
};
