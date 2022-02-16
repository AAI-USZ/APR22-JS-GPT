var Project = require('../core/Project');
var open = require('opn');
var endpointParser = require('bower-endpoint-parser');
var createError = require('../util/createError');
var defaultConfig = require('../config');

function home(logger, name, config) {
var project;
var promise;
var decEndpoint;

config = defaultConfig(config);
project = new Project(config, logger);




if (!name) {
promise = project.hasJson().then(function(json) {
if (!json) {
throw createError('You are not inside a package', 'ENOENT');
}

return project.getJson();
});
} else {
decEndpoint = endpointParser.decompose(name);
promise = project
