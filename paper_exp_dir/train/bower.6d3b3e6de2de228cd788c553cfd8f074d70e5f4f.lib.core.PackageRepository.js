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
registryOptions.cache = this._config.roaming.registry;
this._registryClient = new RegistryClient(registryOptions);


this._resolveCache = new ResolveCache(this._config);
}



