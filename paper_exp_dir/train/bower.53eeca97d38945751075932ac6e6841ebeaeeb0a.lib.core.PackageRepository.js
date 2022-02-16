var mout = require('mout');
var Q = require('q');
var RegistryClient = require('bower-registry-client');
var ResolveCache = require('./ResolveCache');
var resolverFactory = require('./resolverFactory');
var createError = require('../util/createError');

function PackageRepository(config, logger) {
var registryOptions;

this._config = config;
this._logger = logger;


registryOptions = mout.object.deepMixIn({}, this._config);
registryOptions.cache = this._config.storage.registry;
this._registryClient = new RegistryClient(registryOptions, logger);


this._resolveCache = new ResolveCache(this._config);
}



PackageRepository.prototype.fetch = function (decEndpoint) {
var logger;
var that = this;
var isTargetable;
var info = {
decEndpoint: decEndpoint
};



logger = this._logger.geminate();

logger.intercept(function (log) {
that._extendLog(log, info);
});

return this._getResolver(decEndpoint, logger)


.then(function (resolver) {
info.resolver = resolver;
isTargetable = resolver.constructor.isTargetable;

if (!resolver.isCacheable()) {
return that._resolve(resolver, logger);
}


if (that._config.force) {
logger.action('resolve', resolver.getSource() + '#' + resolver.getTarget());
return that._resolve(resolver, logger);
}



return that._resolveCache.retrieve(resolver.getSource(), resolver.getTarget())

.spread(function (canonicalDir, pkgMeta) {

if (!canonicalDir) {

if (that._config.offline) {
throw createError('No cached version for ' + resolver.getSource() + '#' + resolver.getTarget(), 'ENOCACHE', {
resolver: resolver
});
}


logger.info('not-cached', resolver.getSource() + (resolver.getTarget() ? '#' + resolver.getTarget() : ''));
logger.action('resolve', resolver.getSource() + '#' + resolver.getTarget());

return that._resolve(resolver, logger);
}

info.canonicalDir = canonicalDir;
info.pkgMeta = pkgMeta;

logger.info('cached', resolver.getSource() + (pkgMeta._release ? '#' + pkgMeta._release : ''));


if (that._config.offline) {
return [canonicalDir, pkgMeta, isTargetable];
}


logger.action('validate', (pkgMeta._release ? pkgMeta._release + ' against ' : '') +
resolver.getSource() + (resolver.getTarget() ? '#' + resolver.getTarget() : ''));

return resolver.hasNew(pkgMeta)
.then(function (hasNew) {


if (!hasNew) {
return [canonicalDir, pkgMeta, isTargetable];
}


logger.info('new', 'version for ' + resolver.getSource() + '#' + resolver.getTarget());
logger.action('resolve', resolver.getSource() + '#' + resolver.getTarget());

return that._resolve(resolver, logger);
});
});
})

.fail(function (err) {
that._extendLog(err, info);
throw err;
});
};

PackageRepository.prototype.versions = function (source) {


return this._getResolver({ source: source })
.then(function (resolver) {

if (this._config.offline) {
return this._resolveCache.versions(resolver.getSource());
}


return resolver.constructor.versions(resolver.getSource());
}.bind(this));
};

PackageRepository.prototype.eliminate = function (pkgMeta) {
return Q.all([
this._resolveCache.eliminate(pkgMeta),
Q.nfcall(this._registryClient.clearCache.bind(this._registryClient), pkgMeta.name)
]);
};

PackageRepository.prototype.clear = function () {
return Q.all([
this._resolveCache.clear(),
Q.nfcall(this._registryClient.clearCache.bind(this._registryClient))
]);
};

PackageRepository.prototype.reset = function () {
this._resolveCache.reset();
this._registryClient.resetCache();
};

PackageRepository.prototype.list = function () {
return this._resolveCache.list();
};

PackageRepository.prototype.getRegistryClient = function () {
return this._registryClient;
};

PackageRepository.prototype.getResolveCache = function () {
return this._resolveCache;
};

PackageRepository.clearRuntimeCache = function () {
ResolveCache.clearRuntimeCache();
RegistryClient.clearRuntimeCache();
resolverFactory.clearRuntimeCache();
};



PackageRepository.prototype._getResolver = function (decEndpoint, logger) {
logger = logger || this._logger;


return resolverFactory(decEndpoint, { config: this._config, logger: logger }, this._registryClient);
};

PackageRepository.prototype._resolve = function (resolver, logger) {
var that = this;


return resolver.resolve()

.then(function (canonicalDir) {
if (!resolver.isCacheable()) {
return canonicalDir;
}

return that._resolveCache.store(canonicalDir, resolver.getPkgMeta());
})

.then(function (dir) {
var pkgMeta = resolver.getPkgMeta();

logger.info('resolved', resolver.getSource() + (pkgMeta._release ? '#' + pkgMeta._release : ''));
return [dir, pkgMeta, resolver.constructor.isTargetable()];
});
};

PackageRepository.prototype._extendLog = function (log, info) {
log.data = log.data || {};


if (info.decEndpoint) {
log.data.endpoint = mout.object.pick(info.decEndpoint, ['name', 'source', 'target']);
}


if (info.resolver) {
log.data.resolver = {
name: info.resolver.getName(),
source: info.resolver.getSource(),
target: info.resolver.getTarget()
};
}


if (info.canonicalDir) {
log.data.canonicalDir = info.canonicalDir;
log.data.pkgMeta = info.pkgMeta;
}

return log;
};

module.exports = PackageRepository;
