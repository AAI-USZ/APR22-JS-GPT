var mout = require('mout');
var Logger = require('bower-logger');
var endpointParser = require('bower-endpoint-parser');
var Project = require('../core/Project');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function install(endpoints, options, config) {
var project;
var decEndpoints;
var logger = new Logger();

options = options || {};
config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);


endpoints = endpoints || [];
decEndpoints = endpoints.map(function (endpoint) {
return endpointParser.decompose(endpoint);
});

project.install(decEndpoints, options)
.done(function (installed) {
logger.emit('end', installed);
}, function (error) {
logger.emit('error', error);
});

return logger;
}



install.line = function (argv) {
var options = install.options(argv);
