var mout = require('mout');
var Logger = require('bower-logger');
var Project = require('../core/Project');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function prune(options, config) {
var project;
var logger = new Logger();

options = options || {};
config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);

clean(project, options)
.done(function (removed) {
logger.emit('end', removed);
}, function (error) {
logger.emit('error', error);
