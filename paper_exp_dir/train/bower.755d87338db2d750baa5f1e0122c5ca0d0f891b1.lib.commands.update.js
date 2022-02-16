







var Emitter = require('events').EventEmitter;
var async   = require('async');
var nopt    = require('nopt');
var _       = require('lodash');

var Manager   = require('../core/manager');
var help      = require('./help');
var uninstall = require('./uninstall');

var optionTypes = { help: Boolean, force: Boolean, 'force-latest': Boolean };
var shorthand   = { 'h': ['--help'], 'f': ['--force'], 'F': ['--force-latest'] };

module.exports = function (names, options) {
options = options || {};

var emitter = new Emitter;
var manager = new Manager([], {
force: options.force,
forceLatest: options['force-latest']
});

manager.on('data',  emitter.emit.bind(emitter, 'data'));
manager.on('error', emitter.emit.bind(emitter, 'error'));

