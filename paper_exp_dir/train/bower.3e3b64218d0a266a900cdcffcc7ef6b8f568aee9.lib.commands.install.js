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
