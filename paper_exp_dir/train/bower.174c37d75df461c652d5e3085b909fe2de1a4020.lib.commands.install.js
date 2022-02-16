












var Emitter = require('events').EventEmitter;
var nopt    = require('nopt');
var fs      = require('fs');
var path    = require('path');

var Manager = require('../core/manager');
var config  = require('../core/config');
var source  = require('../core/source');
var save    = require('../util/save');
var help    = require('./help');

var optionTypes = { help: Boolean, save: Boolean, force: Boolean };
