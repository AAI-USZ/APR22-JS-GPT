var endpointParser = require('bower-endpoint-parser');
var Project = require('../core/Project');
var defaultConfig = require('../config');

function install(logger, endpoints, options, config) {
var project;
var decEndpoints;

options = options || {};
config = defaultConfig(config);
if (options.save === undefined) {
options.save = config.defaultSave;
}
project = new Project(config, logger);


endpoints = endpoints || [];
decEndpoints = endpoints.map(function(endpoint) {

var splitParts = endpoint.split('/');
splitParts[splitParts.length - 1] = splitParts[
splitParts.length - 1
].replace('@', '#');
endpoint = splitParts.join('/');

return endpointParser.decompose(endpoint);
});

