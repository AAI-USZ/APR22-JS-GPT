var fs = require('graceful-fs');
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

promise = Q.nfcall(bowerJson.read, metaFile)
.then(function (pkgMeta) {
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




Resolver.prototype._resolve = function () {
throw new Error('_resolve not implemented');
};



Resolver.prototype._hasNew = function (canonicalDir, pkgMeta) {
return Q.resolve(true);
};

Resolver.isTargetable = function () {
return true;
};

Resolver.versions = function (source) {
return Q.resolve([]);
};

Resolver.clearRuntimeCache = function () {};



Resolver.prototype._createTempDir = function () {
var baseDir = path.join(this._config.tmp, 'bower');

return Q.nfcall(mkdirp, baseDir)
.then(function () {
return Q.nfcall(tmp.dir, {
template: path.join(baseDir, this._name + '-' + process.pid + '-XXXXXX'),
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
dir = dir || this._tempDir;

return Q.nfcall(bowerJson.find, dir)
.then(function (filename) {

if (path.basename(filename) === 'component.json') {
this._logger.warn('deprecated', 'Package ' + this._name + ' is using the deprecated component.json file', {
json: filename
});
}


return Q.nfcall(bowerJson.read, filename)
.fail(function (err) {
throw createError('Something went wrong while reading ' + filename, err.code, {
details: err.message,
data: {
json: filename
}
});
});
}.bind(this), function () {

return Q.nfcall(bowerJson.parse, {
name: this._name
});
}.bind(this));
};

Resolver.prototype._applyPkgMeta = function (meta) {


if (meta.name !== this._name && this._guessedName) {
this._name = meta.name;
}



if (!meta.ignore || !meta.ignore.length) {
return Q.resolve(meta);
}


return removeIgnores(this._tempDir, meta.ignore)
.then(function () {
return meta;
});
};

Resolver.prototype._savePkgMeta = function (meta) {
var contents;


meta._source = this._source;
meta._target = this._target;


contents = JSON.stringify(meta, null, 2);

return Q.nfcall(fs.writeFile, path.join(this._tempDir, '.bower.json'), contents)
.then(function () {
return this._pkgMeta = meta;
}.bind(this));
};

module.exports = Resolver;
