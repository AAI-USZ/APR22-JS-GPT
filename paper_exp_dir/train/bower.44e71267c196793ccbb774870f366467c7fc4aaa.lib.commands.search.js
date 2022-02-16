var Q = require('q');
var PackageRepository = require('../core/PackageRepository');
var defaultConfig = require('../config');
var cli = require('../util/cli');

function search(logger, name, config) {
config = defaultConfig(config);

var repository = new PackageRepository(config, logger);
var registryClient = repository.getRegistryClient();

if (name) {
return Q.nfcall(registryClient.search.bind(registryClient), name);
} else {


if (config.interactive && !config.json) {
