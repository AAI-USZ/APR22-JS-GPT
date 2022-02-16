var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var Project = require('../core/Project');
var Logger = require('../core/Logger');
var cli = require('../util/cli');
var help = require('./help');
var defaultConfig = require('../config');

function update(names, options, config) {
var project;
var emitter = new EventEmitter();
var logger = new Logger();

options = options || {};
config = mout.object.deepMixIn(config, defaultConfig);


if (names && !names.length) {
names = null;
}

emitter = new EventEmitter();
emitter.command = 'update';

project = new Project(config, logger);
project.update(names, options)
.then(function (installed) {
emitter.emit('end', installed);
}, function (error) {
emitter.emit('error', error);
});

return logger.pipe(emitter);
}



update.line = function (argv) {
var options = update.options(argv);

if (options.help) {
return help('update');
}

return update(options.argv.remain.slice(1), options);
};

update.options = function (argv) {
return cli.readOptions({
'help': { type: Boolean, shorthand: 'h' },
'production': { type: Boolean, shorthand: 'p' },
'save-resolutions': { type: Boolean, shorthand: 'r' }
}, argv);
};

update.completion = function () {

};
