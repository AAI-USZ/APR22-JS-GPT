var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var RegistryClient = require('bower-registry-client');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function lookup(name, config) {
var registryClient;
var emitter = new EventEmitter();

config = mout.object.deepMixIn(config || {}, defaultConfig);
config.cache = config.storage.registry;

registryClient = new RegistryClient(config);
registryClient.lookup(name, function (error, entry) {
if (error) {
return emitter.emit('error', error);
}

