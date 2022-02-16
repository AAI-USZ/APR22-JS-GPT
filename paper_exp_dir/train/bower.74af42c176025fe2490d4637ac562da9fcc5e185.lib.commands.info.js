var mout = require('mout');
var Q = require('q');
var endpointParser = require('bower-endpoint-parser');
var PackageRepository = require('../core/PackageRepository');
var defaultConfig = require('../config');

function info(logger, endpoint, property, config) {
if (!endpoint) {
return;
}


var splitParts = endpoint.split('/');
splitParts[splitParts.length - 1] = splitParts[splitParts.length - 1].replace('@', '#');
endpoint = splitParts.join('/');


var repository;
var decEndpoint;

config = defaultConfig(config);
repository = new PackageRepository(config, logger);

decEndpoint = endpointParser.decompose(endpoint);
