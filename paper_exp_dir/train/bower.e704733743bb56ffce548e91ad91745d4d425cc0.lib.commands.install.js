var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var Project = require('../core/Project');
var Logger = require('../core/Logger');
var cli = require('../util/cli');
var help = require('./help');
var defaultConfig = require('../config');

function install(endpoints, options, config) {
var project;
var emitter = new EventEmitter();
var logger = new Logger();

options = options || {};
config = mout.object.deepMixIn(config, defaultConfig);


if (endpoints && !endpoints.length) {
endpoints = null;
}

emitter.command = 'install';

project = new Project(config, logger);
project.install(endpoints, options)
.then(function (installed) {
emitter.emit('end', installed);
}, function (error) {
emitter.emit('error', error);
});

return logger.pipe(emitter);
}



install.line = function (argv) {
var options = install.options(argv);

if (options.help) {
return help('install');
}

return install(options.argv.remain.slice(1), options);
};

install.options = function (argv) {
return cli.readOptions({
'help': { type: Boolean, shorthand: 'h' },
'production': { type: Boolean, shorthand: 'p' },
'save': { type: Boolean, shorthand: 'S' },
'save-dev': { type: Boolean, shorthand: 'D' },
'save-resolutions': { type: Boolean, shorthand: 'r' }
}, argv);
};

install.completion = function () {

};
