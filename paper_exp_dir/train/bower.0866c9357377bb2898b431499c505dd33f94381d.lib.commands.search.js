var mout = require('mout');
var Q = require('q');
var Logger = require('bower-logger');
var RegistryClient = require('bower-registry-client');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function search(name, config) {
var registryClient;
var promise;
var logger = new Logger();

config = mout.object.deepFillIn(config || {}, defaultConfig);
config.cache = config.storage.registry;

registryClient = new RegistryClient(config, logger);


if (!name) {
promise = Q.nfcall(registryClient.list.bind(registryClient));

} else {
promise = Q.nfcall(registryClient.search.bind(registryClient), name);
}

promise
.done(function (results) {
logger.emit('end', results);
}, function (error) {
logger.emit('error', error);
});

return logger;
}



search.line = function (argv) {
var options = search.options(argv);
