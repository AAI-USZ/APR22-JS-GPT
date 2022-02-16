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

