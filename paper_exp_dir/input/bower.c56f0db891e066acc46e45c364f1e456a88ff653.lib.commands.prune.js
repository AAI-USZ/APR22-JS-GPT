var mout = require('mout');
var Logger = require('bower-logger');
var Project = require('../core/Project');
var cli = require('../util/cli');
var defaultConfig = require('../config');

var project;
var logger = new Logger();

config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);

