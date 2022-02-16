var Q = require('q');
var PackageRepository = require('../core/PackageRepository');
var defaultConfig = require('../config');

function lookup(logger, name, config) {
if (!name) {
return new Q(null);
}

config = defaultConfig(config);

var repository = new PackageRepository(config, logger);
var registryClient = repository.getRegistryClient();

return Q.nfcall(registryClient.lookup.bind(registryClient), name).then(
function(entry) {
return !entry
? null
: {
name: name,
url: entry.url
};
}
);
