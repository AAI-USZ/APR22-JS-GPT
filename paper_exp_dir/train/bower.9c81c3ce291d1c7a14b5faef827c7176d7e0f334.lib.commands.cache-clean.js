







var Emitter     = require('events').EventEmitter;
var async       = require('async');
var nopt        = require('nopt');
var rimraf      = require('rimraf');
var path        = require('path');
var glob        = require('glob');
var _           = require('lodash');

var help        = require('./help');
var config      = require('../core/config');
