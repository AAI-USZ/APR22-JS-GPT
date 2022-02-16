var Q = require('q');
var RegistryClient = require('bower-registry-client');
var Tracker = require('../util/analytics').Tracker;
var defaultConfig = require('../config');
var cli = require('../util/cli');

function search(logger, name, config) {
var registryClient;
var tracker;

var json = config ? config.json : undefined;
config = defaultConfig(config);
config.json = config.json || json;
config.cache = config.storage.registry;

