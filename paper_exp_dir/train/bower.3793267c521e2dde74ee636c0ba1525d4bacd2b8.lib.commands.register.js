







var Emitter  = require('events').EventEmitter;
var nopt     = require('nopt');
var readline = require('readline');

var template = require('../util/template');
var source   = require('../core/source');
var help     = require('./help');


var optionTypes = { help: Boolean };
var shorthand   = { 'h': ['--help'] };

