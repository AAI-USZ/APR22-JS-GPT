







var Emitter  = require('events').EventEmitter;
var async    = require('async');
var nopt     = require('nopt');
var rimraf   = require('rimraf');
var path     = require('path');
var fs       = require('fs');
var glob     = require('glob');
var _        = require('lodash');

var help     = require('./help');
var config   = require('../core/config');
var template = require('../util/template');

var optionTypes = { help: Boolean, force: Boolean };
var shorthand   = { 'h': ['--help'], 'S': ['--save'], 'f': ['--force'] };

var removePkg = function (pkg, emitter, next) {
