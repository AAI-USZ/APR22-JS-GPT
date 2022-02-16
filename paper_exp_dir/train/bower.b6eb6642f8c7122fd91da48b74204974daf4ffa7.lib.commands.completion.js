







var Emitter  = require('events').EventEmitter;
var path     = require('path');
var nopt     = require('nopt');
var mkdirp   = require('mkdirp');

var template = require('../util/template');
var complete = require('../util/completion');
var config   = require('../core/config');
var help     = require('./help');
