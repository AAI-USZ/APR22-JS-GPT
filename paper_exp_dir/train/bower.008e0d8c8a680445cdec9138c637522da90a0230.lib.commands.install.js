












var Emitter  = require('events').EventEmitter;
var async    = require('async');
var nopt     = require('nopt');

var Manager  = require('../core/manager');
var save     = require('../util/save');
var list     = require('./list');
var help     = require('./help');
var template = require('../util/template');

var optionTypes = { help: Boolean, force: Boolean };
