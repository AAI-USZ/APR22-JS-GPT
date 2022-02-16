var Q = require('q');
var RegistryClient = require('bower-registry-client');
var defaultConfig = require('../config');
var cli = require('../util/cli');

function search(logger, name, config) {
var registryClient;

var json = config ? config.json : undefined;
config = defaultConfig(config);
config.json = config.json || json;
config.cache = config.storage.registry;
