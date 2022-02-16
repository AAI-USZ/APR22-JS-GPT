var readline = require('readline');
var fs = require('fs');
var util = require('util');
var path = require('path');
var glob = require('glob');
var mm = require('minimatch');
var exec = require('child_process').exec;

var helper = require('./helper');
var logger = require('./logger');
var constant = require('./constants');

var log = logger.create('init');

var StateMachine = require('./init/state_machine');
var COLOR_SCHEME = require('./init/color_schemes');

var JS_TPL_PATH = __dirname + '/../config.tpl.js';
var COFFEE_TPL_PATH = __dirname + '/../config.tpl.coffee';







var logQueue = [];

var printLogQueue = function() {
while (logQueue.length) {
