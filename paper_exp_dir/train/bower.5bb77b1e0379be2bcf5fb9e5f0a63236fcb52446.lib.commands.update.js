var Project = require('../core/Project');
var defaultConfig = require('../config');

function update(logger, names, options, config) {
var project;

options = options || {};
config = defaultConfig(config);
project = new Project(config, logger);


if (names && !names.length) {
