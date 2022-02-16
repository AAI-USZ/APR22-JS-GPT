












var Emitter = require('events').EventEmitter;
var nopt    = require('nopt');

var Manager = require('../core/manager');
var save    = require('../util/save');
var help    = require('./help');

var optionTypes = { help: Boolean, force: Boolean };
var shorthand   = { 'h': ['--help'], 'S': ['--save'], 'f': ['--force'] };

module.exports = function (paths, options) {
