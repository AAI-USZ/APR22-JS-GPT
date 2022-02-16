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



this._options.registry = new RegistryClient(mout.object.fillIn({
cache: this._config.roaming.registry
}, this._config));

this._resolveCache = new ResolveCache(this._config.roaming.cache);
