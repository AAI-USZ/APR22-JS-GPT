var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var Project = require('../core/Project');
var Logger = require('../core/Logger');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function uninstall(names, options, config) {
var project;
var emitter = new EventEmitter();
var logger = new Logger();

options = options || {};
config = mout.object.deepMixIn(config || {}, defaultConfig);
project = new Project(config, logger);


if (names && !names.length) {
names = null;
}

emitter = new EventEmitter();

project.uninstall(names, options)
.then(function (installed) {
emitter.emit('end', installed);
})
.fail(function (error) {
emitter.emit('error', error);
});

return logger.pipe(emitter);
}



uninstall.line = function (argv) {
var options = uninstall.options(argv);
