var mout = require('mout');
var Q = require('q');
var RegistryClient = require('bower-registry-client');
var ResolveCache = require('./ResolveCache');
var resolverFactory = require('./resolverFactory');
var defaultConfig = require('../config');
var createError = require('../util/createError');

var PackageRepository = function (options) {
options = options || {};
options.config = options.config || defaultConfig;

this._options = options;
this._config = options.config;



cache: this._config.roaming.registry
}, this._config));

this._resolveCache = new ResolveCache(this._config.roaming.cache);
};



PackageRepository.prototype.fetch = function (decEndpoint) {
var resolver;
var deferred = Q.defer();
var that = this;


resolverFactory(decEndpoint, this._options)


.then(function (res) {
resolver = res;


decEndpoint.resolverName = res.getName();


if (that._options.force) {
deferred.notify({ type: 'action', data: 'Resolving' });
return that._resolve(resolver);
}



return that._resolveCache.retrieve(resolver.getSource(), resolver.getTarget())

.spread(function (canonicalPkg, pkgMeta) {

if (!canonicalPkg) {

if (that._options.offline) {
throw createError('No cached version for ' + resolver.getTarget(), 'ENOCACHE');
}


deferred.notify({ type: 'action', data: 'No cached version, resolving..' });
return that._resolve(resolver);
}


if (that._options.offline) {
deferred.notify({ type: 'action', data: 'Got cached version' });
return [canonicalPkg, pkgMeta];
}


process.nextTick(function () {
deferred.notify({ type: 'action', data: 'Got cached version, validating..' });
});

return resolver.hasNew(canonicalPkg, pkgMeta)
.then(function (hasNew) {


if (!hasNew) {
return [canonicalPkg, pkgMeta];
}


deferred.notify({ type: 'action', data: 'There\'s a new version, resolving..' });

return that._resolve(resolver);
});
});
})
.then(deferred.resolve, deferred.reject, deferred.notify);

return deferred.promise;
};

PackageRepository.prototype.empty = function (name) {




};



PackageRepository.prototype._resolve = function (resolver) {

return resolver.resolve()

.then(function (canonicalPkg) {
return this._resolveCache.store(canonicalPkg, resolver.getPkgMeta());
}.bind(this))

.then(function (dir) {
return [dir, resolver.getPkgMeta()];
}.bind(this));
};

module.exports = PackageRepository;
