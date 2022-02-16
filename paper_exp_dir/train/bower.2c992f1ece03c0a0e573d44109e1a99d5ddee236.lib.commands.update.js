







var Emitter = require('events').EventEmitter;
var async   = require('async');
var nopt    = require('nopt');
var _       = require('lodash');

var Manager   = require('../core/manager');
var help      = require('./help');
var uninstall = require('./uninstall');
var save      = require('../util/save');

var optionTypes = { help: Boolean, save: Boolean, force: Boolean, 'force-latest': Boolean };
var shorthand   = { 'h': ['--help'], 'S': ['--save'], 'f': ['--force'], 'F': ['--force-latest'] };

module.exports = function (names, options) {
options = options || {};

var emitter = new Emitter;
var manager = new Manager([], {
