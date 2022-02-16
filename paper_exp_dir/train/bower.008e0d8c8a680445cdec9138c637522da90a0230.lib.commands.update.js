







var Emitter = require('events').EventEmitter;
var async   = require('async');
var nopt    = require('nopt');
var _       = require('lodash');

var Manager = require('../core/manager');
var install = require('./install');
var help    = require('./help');
var template = require('../util/template');

var shorthand   = { 'h': ['--help'] };
var optionTypes = { help: Boolean };

module.exports = function (argv) {
var manager = new Manager;
var emitter = new Emitter;

manager.on('data',  emitter.emit.bind(emitter, 'data'));
