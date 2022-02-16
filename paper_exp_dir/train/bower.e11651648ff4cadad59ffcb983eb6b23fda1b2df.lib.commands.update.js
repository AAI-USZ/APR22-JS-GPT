







var Emitter = require('events').EventEmitter;
var async   = require('async');
var nopt    = require('nopt');
var _       = require('lodash');

var Manager   = require('../core/manager');
var help      = require('./help');
var uninstall = require('./uninstall');

var shorthand   = { 'h': ['--help'], 'f': ['--force'] };
var optionTypes = { help: Boolean, force: Boolean };

module.exports = function (names, options) {
var manager = new Manager([], { force: options && options.force });
var emitter = new Emitter;
