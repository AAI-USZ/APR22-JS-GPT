var fs = require('graceful-fs');
var path = require('path');
var Q = require('q');
var tmp = require('tmp');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
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

Resolver.prototype.isNotCacheable = function () {

if (this._source &&
/^(?:file:[\/\\]{2})?\.?\.?[\/\\]/.test(this._source)
) {
return true;
}


if (this._pkgMeta &&
this._pkgMeta._resolution &&
this._pkgMeta._resolution.type === 'branch')
{
return true;
}

return false;
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
return Q.nfcall(mkdirp, this._config.tmp)
.then(function () {
return Q.nfcall(tmp.dir, {
template: path.join(this._config.tmp, this._name + '-' + process.pid + '-XXXXXX'),
mode: 0777 & ~process.umask(),
unsafeCleanup: true
});
}.bind(this))
.then(function (dir) {

return this._tempDir = Array.isArray(dir) ? dir[0] : dir;
}.bind(this));
};

Resolver.prototype._cleanTempDir = function () {
var tempDir = this._tempDir;

if (!tempDir) {
return Q.resolve();
}


return Q.nfcall(rimraf, tempDir)
.then(function () {
return Q.nfcall(mkdirp, tempDir, 0777 & ~process.umask());
})
.then(function () {
return tempDir;
});
};

Resolver.prototype._readJson = function (dir) {
var that = this;

dir = dir || this._tempDir;
return readJson(dir, {
assume: { name: this._name }
})
.spread(function (json, deprecated) {
if (deprecated) {
that._logger.warn('deprecated', 'Package ' + that._name + ' is using the deprecated ' + deprecated);
}

return json;
});
};

Resolver.prototype._applyPkgMeta = function (meta) {


if (meta.name !== this._name && this._guessedName) {
this._name = meta.name;
}



if (!meta.ignore || !meta.ignore.length) {
return Q.resolve(meta);
}


return removeIgnores(this._tempDir, meta)
.then(function () {
return meta;
});
};

Resolver.prototype._savePkgMeta = function (meta) {
var that = this;
var contents;


meta._source = this._source;
meta._target = this._target;

['main', 'ignore'].forEach(function (attr) {
if (meta[attr]) return;

that._logger.log(
'warn', 'invalid-meta',
(meta.name || 'component') + ' is missing "' + attr + '" entry in bower.json'
);
});


contents = JSON.stringify(meta, null, 2);

return Q.nfcall(fs.writeFile, path.join(this._tempDir, '.bower.json'), contents)
.then(function () {
return that._pkgMeta = meta;
});
};

module.exports = Resolver;
