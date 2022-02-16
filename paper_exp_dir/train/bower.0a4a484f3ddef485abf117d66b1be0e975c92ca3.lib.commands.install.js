












var Emitter = require('events').EventEmitter;
var async   = require('async');
var nopt    = require('nopt');

var Manager = require('../core/manager');
var save    = require('../util/save');
var list    = require('./list');
var help    = require('./help');

var optionTypes = { help: Boolean };
var shorthand   = { 'h': ['--help'], 'S': ['--save'] };

module.exports = function (paths, options) {
var emitter = new Emitter;
var manager = new Manager(paths);

if (options && options.save) save(emitter, manager, paths);

manager
.on('data'    , emitter.emit.bind(emitter, 'data'))
.on('error'   , emitter.emit.bind(emitter, 'error'))
.on('resolve' , emitter.emit.bind(emitter, 'end'))
.resolve();

return emitter;
};

module.exports.line = function (argv) {
var options  = nopt(optionTypes, shorthand, argv);
var paths    = options.argv.remain.slice(1);

if (options.help) return help('install');
return module.exports(paths, options);
};
