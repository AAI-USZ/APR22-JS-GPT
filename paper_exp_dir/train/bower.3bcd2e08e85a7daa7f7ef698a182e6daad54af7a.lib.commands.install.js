












var Emitter = require('events').EventEmitter;
var async   = require('async');
var nopt    = require('nopt');

var Manager = require('../core/manager');
var save    = require('../util/save');
var list    = require('./list');
var help    = require('./help');

var optionTypes = { help: Boolean, force: Boolean };
var shorthand   = { 'h': ['--help'], 'S': ['--save'], 'f': ['--force'] };
