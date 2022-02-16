var Q = require('q');
var RegistryClient = require('bower-registry-client');
var Tracker = require('../util/analytics').Tracker;
var defaultConfig = require('../config');

function search(logger, name, config) {
var registryClient;
var tracker;

config = defaultConfig(config);
config.cache = config.storage.registry;

