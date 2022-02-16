var mout = require('mout');
var Project = require('../core/Project');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function update(logger, names, options, config) {
var project;

options = options || {};
config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);
