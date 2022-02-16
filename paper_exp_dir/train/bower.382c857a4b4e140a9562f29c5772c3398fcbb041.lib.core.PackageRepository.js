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



this._options.registryClient = new RegistryClient(mout.object.fillIn({
cache: this._config.roaming.registry
}, this._config));

this._resolveCache = new ResolveCache(this._config.roaming.cache);
};



PackageRepository.prototype.fetch = function (decEndpoint) {
var res;
var deferred = Q.defer();
var that = this;


resolverFactory(decEndpoint, this._options)


.then(function (resolver) {
res = resolver;


decEndpoint.resolverName = resolver.getName();


if (that._options.force) {
deferred.notify({
level: 'action',
tag: 'resolve',
resolver: resolver,
data: resolver.getSource() + '#' + resolver.getTarget()
});
return that._resolve(resolver);
}



return that._resolveCache.retrieve(resolver.getSource(), resolver.getTarget())

.spread(function (canonicalPkg, pkgMeta) {

if (!canonicalPkg) {

if (that._options.offline) {
throw createError('No cached version for ' + resolver.getSource() + '#' + resolver.getTarget(), 'ENOCACHE', {
resolver: resolver
});
}


deferred.notify({
level: 'info',
tag: 'uncached',
data: 'No cached version for ' + resolver.getSource() + '#' + resolver.getTarget(),
});
deferred.notify({
level: 'action',
tag: 'resolve',
resolver: resolver,
data: 'Resolving ' + resolver.getSource() + '#' + resolver.getTarget(),
});

return that._resolve(resolver);
}

deferred.notify({
level: 'info',
tag: 'cached',
data: 'Got cached ' + resolver.getSource() + (pkgMeta._release ? '#' + pkgMeta._release: '') + ' entry',
canonicalPkg: canonicalPkg,
pkgMeta: pkgMeta
});


if (that._options.offline) {
return [canonicalPkg, pkgMeta];
}


process.nextTick(function () {
deferred.notify({
level: 'action',
tag: 'check',
data: 'Checking ' + resolver.getSource() + '#' + resolver.getTarget() + ' for newer version',
canonicalPkg: canonicalPkg,
pkgMeta: pkgMeta,
resolver: resolver
});
});

return resolver.hasNew(canonicalPkg, pkgMeta)
.then(function (hasNew) {


if (!hasNew) {
return [canonicalPkg, pkgMeta];
}


deferred.notify({
type: 'info',
data: 'There\'s a new version for ' + resolver.getSource() + '#' + resolver.getTarget(),
canonicalPkg: canonicalPkg,
pkgMeta: pkgMeta,
resolver: resolver
});
deferred.notify({
type: 'resolve',
resolver: resolver,
data: 'Resolving ' + resolver.getSource() + '#' + resolver.getTarget()
});

return that._resolve(resolver);
});
});
})
.then(deferred.resolve, deferred.reject, function (notification) {

notification.resolver = res;
deferred.notify(notification);
});

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
