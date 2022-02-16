var mout = require('mout');
var Logger = require('bower-logger');
var Project = require('../core/Project');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function update(names, options, config) {
var project;
var logger = new Logger();

options = options || {};
config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);


if (names && !names.length) {
names = null;
}

project.update(names, options)
.done(function (installed) {
logger.emit('end', installed);
}, function (error) {
logger.emit('error', error);
});

return logger;
}



update.line = function (argv) {
var options = update.options(argv);
