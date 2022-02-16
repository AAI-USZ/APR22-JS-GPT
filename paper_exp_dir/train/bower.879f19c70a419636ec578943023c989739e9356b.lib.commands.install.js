












var Emitter = require('events').EventEmitter;
var nopt    = require('nopt');

var Manager = require('../core/manager');
var save    = require('../util/save');
var help    = require('./help');

var optionTypes = { help: Boolean, save: Boolean, force: Boolean };
var shorthand   = { 'h': ['--help'], 'S': ['--save'], 'f': ['--force'] };

module.exports = function (paths, options) {
options = options || {};

var emitter = new Emitter;
var manager = new Manager(paths, { force: options && options.force });

if (options.save) save(manager, paths);

manager
.on('data', emitter.emit.bind(emitter, 'data'))
.on('error', emitter.emit.bind(emitter, 'error'))
.on('resolve', emitter.emit.bind(emitter, 'end', null))
