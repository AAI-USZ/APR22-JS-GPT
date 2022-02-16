var Q = require('q');
var RegistryClient = require('bower-registry-client');
var cli = require('../util/cli');
var Tracker = require('../util/analytics').Tracker;
var defaultConfig = require('../config');

function search(logger, name, config) {
var registryClient;
var tracker;

config = defaultConfig(config);
config.cache = config.storage.registry;

registryClient = new RegistryClient(config, logger);
tracker = new Tracker(config);
tracker.track('search', name);


if (!name) {
return Q.nfcall(registryClient.list.bind(registryClient));

} else {
return Q.nfcall(registryClient.search.bind(registryClient), name);
}
}



search.line = function (logger, argv) {
var options = cli.readOptions(argv);
var name = options.argv.remain.slice(1).join(' ');
return search(logger, name, options);
};

module.exports = search;
