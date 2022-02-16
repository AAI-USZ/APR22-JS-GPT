var readline = require('readline');
var fs = require('fs');
var util = require('util');
var path = require('path');
var glob = require('glob');
var mm = require('minimatch');
var exec = require('child_process').exec;
var EventEmitter = require('events').EventEmitter;

var helper = require('./helper');
var logger = require('./logger');
var constant = require('./constants');

var log = logger.create('init');

var JS_TPL_PATH = __dirname + '/../config.tpl.js';
var COFFEE_TPL_PATH = __dirname + '/../config.tpl.coffee';






var COLORS_ON = {
END: '\x1B[39m',
NYAN: '\x1B[36m',
GREEN: '\x1B[32m',
BOLD: '\x1B[1m',
bold: function(str) {
