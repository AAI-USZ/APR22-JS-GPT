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
