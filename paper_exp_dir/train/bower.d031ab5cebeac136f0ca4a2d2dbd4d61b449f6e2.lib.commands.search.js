var mout = require('mout');
var Q = require('q');
var Logger = require('bower-logger');
var RegistryClient = require('bower-registry-client');
var cli = require('../util/cli');
var Tracker = require('../util/analytics').Tracker;
var defaultConfig = require('../config');

function search(name, config) {
var registryClient;
var promise;
var tracker;
var logger = new Logger();

config = mout.object.deepFillIn(config || {}, defaultConfig);
config.cache = config.storage.registry;

registryClient = new RegistryClient(config, logger);
tracker = new Tracker(config);
tracker.track('search', name);


if (!name) {
promise = Q.nfcall(registryClient.list.bind(registryClient));

} else {
promise = Q.nfcall(registryClient.search.bind(registryClient), name);
}

promise
