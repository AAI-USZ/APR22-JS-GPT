var mout = require('mout');
var Q = require('q');
var ResolveCache = require('./ResolveCache');
var resolverFactory = require('./resolverFactory');
var createError = require('../util/createError');
var RegistryClient = require('bower-registry-client');

function PackageRepository(config, logger) {
var registryOptions;

this._config = config;
this._logger = logger;


registryOptions = mout.object.deepMixIn({}, this._config);
registryOptions.cache = this._config.storage.registry;

this._registryClient = new RegistryClient(registryOptions, logger);

