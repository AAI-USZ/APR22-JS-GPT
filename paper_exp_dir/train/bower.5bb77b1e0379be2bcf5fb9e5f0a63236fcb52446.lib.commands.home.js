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
