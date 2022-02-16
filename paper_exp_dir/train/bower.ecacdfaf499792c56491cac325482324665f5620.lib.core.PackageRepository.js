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
data: resolver.getSource() + '#' + resolver.getTarget()
});
return that._resolve(resolver);
}



return that._resolveCache.retrieve(resolver.getSource(), resolver.getTarget())

.spread(function (canonicalPkg, pkgMeta) {

if (!canonicalPkg) {
