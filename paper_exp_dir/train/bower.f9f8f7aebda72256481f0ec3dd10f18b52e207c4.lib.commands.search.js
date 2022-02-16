var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var RegistryClient = require('bower-registry-client');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function search(name, config) {
var registryClient;
var emitter = new EventEmitter();

config = mout.object.deepMixIn(config || {}, defaultConfig);
config.cache = config.storage.registry;

registryClient = new RegistryClient(config);


if (!name) {
registryClient.list(onResults.bind(onResults, emitter));

} else {
