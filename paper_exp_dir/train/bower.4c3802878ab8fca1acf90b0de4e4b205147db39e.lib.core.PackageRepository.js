var mout = require('mout');
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
this._registryClient = new RegistryClient(registryOptions);


this._resolveCache = new ResolveCache(this._config);
}



PackageRepository.prototype.fetch = function (decEndpoint) {
var logger;
var that = this;
var info = {
decEndpoint: decEndpoint
};



logger = this._logger.geminate();

logger.intercept(function (log) {
that._extendLog(log, info);
});


return resolverFactory(decEndpoint, this._config, logger, this._registryClient)


.then(function (resolver) {
info.resolver = resolver;


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
return [canonicalDir, pkgMeta];
}


logger.action('validate', (pkgMeta._release ? pkgMeta._release + ' against ': '') +
resolver.getSource() + (resolver.getTarget() ? '#' + resolver.getTarget() : ''));

return resolver.hasNew(canonicalDir, pkgMeta)
.then(function (hasNew) {


if (!hasNew) {
return [canonicalDir, pkgMeta];
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


return resolverFactory.getConstructor(source, this._config, this._registryClient)
.spread(function (ConcreteResolver, source) {

if (this._config.offline) {
return this._resolveCache.versions(source);
}
