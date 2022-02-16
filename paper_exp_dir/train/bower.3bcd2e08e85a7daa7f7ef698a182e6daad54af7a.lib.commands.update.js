







var Emitter = require('events').EventEmitter;
var async   = require('async');
var nopt    = require('nopt');
var _       = require('lodash');

var Manager = require('../core/manager');
var install = require('./install');
var help    = require('./help');

var shorthand   = { 'h': ['--help'] };
var optionTypes = { help: Boolean };

module.exports = function (argv, options) {
var manager = new Manager;
var emitter = new Emitter;

manager.on('data',  emitter.emit.bind(emitter, 'data'));
manager.on('error', emitter.emit.bind(emitter, 'error'));
