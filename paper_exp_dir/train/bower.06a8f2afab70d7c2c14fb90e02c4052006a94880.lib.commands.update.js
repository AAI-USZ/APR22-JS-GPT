var Project = require('../core/Project');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function update(logger, names, options, config) {
var project;

options = options || {};
config = defaultConfig(config);
project = new Project(config, logger);
