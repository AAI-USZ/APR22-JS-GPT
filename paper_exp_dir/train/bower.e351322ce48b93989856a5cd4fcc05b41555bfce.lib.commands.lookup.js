var Q = require('q');
var RegistryClient = require('bower-registry-client');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function lookup(logger, name, config) {
if (!name) {
return new Q(null);
}

var registryClient;

config = defaultConfig(config);
config.cache = config.storage.registry;

registryClient = new RegistryClient(config, logger);
