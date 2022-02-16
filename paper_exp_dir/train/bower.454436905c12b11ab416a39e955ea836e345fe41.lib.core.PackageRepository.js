var mout = require('mout');
var Q = require('q');
var RegistryClient = require('bower-registry-client');
var ResolveCache = require('./ResolveCache');
var resolverFactory = require('./resolverFactory');
var defaultConfig = require('../config');
var createError = require('../util/createError');

function PackageRepository(config) {
var registryOptions;

this._config = config || defaultConfig;


registryOptions = mout.object.deepMixIn({}, this._config);
registryOptions.cache = this._config.roaming.registry;
this._registryClient = new RegistryClient(registryOptions);


this._resolveCache = new ResolveCache(this._config.roaming.cache);
}



PackageRepository.prototype.fetch = function (decEndpoint) {
var res;
var deferred = Q.defer();
var that = this;


resolverFactory(decEndpoint, this._registryClient, this._config)


.then(function (resolver) {
res = resolver;


decEndpoint.resolverName = resolver.getName();


if (that._config.force) {
deferred.notify({
level: 'action',
id: 'resolve',
message: resolver.getSource() + '#' + resolver.getTarget()
});
return that._resolve(resolver);
}



return that._resolveCache.retrieve(resolver.getSource(), resolver.getTarget())

.spread(function (canonicalPkg, pkgMeta) {

if (!canonicalPkg) {

if (that._config.offline) {
throw createError('No cached version for ' + resolver.getSource() + '#' + resolver.getTarget(), 'ENOCACHE', {
resolver: resolver
});
}


deferred.notify({
level: 'info',
id: 'uncached',
message: 'No cached version for ' + resolver.getSource() + '#' + resolver.getTarget()
});
deferred.notify({
level: 'action',
id: 'resolve',
message: resolver.getSource() + '#' + resolver.getTarget()
});

return that._resolve(resolver);
}

deferred.notify({
level: 'info',
id: 'cached',
message: resolver.getSource() + (pkgMeta._release ? '#' + pkgMeta._release: '') + ' entry',
data: {
pkgMeta: pkgMeta
