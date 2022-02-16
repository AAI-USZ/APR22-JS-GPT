var readline = require('readline');
var fs = require('fs');
var util = require('util');
var path = require('path');
var glob = require('glob');
var exec = require('child_process').exec;
var EventEmitter = require('events').EventEmitter;

var helper = require('./helper');
var logger = require('./logger');
var constant = require('./constants');

var log = logger.create('init');

var JS_TPL_PATH = __dirname + '/../config.tpl.js';
var COFFEE_TPL_PATH = __dirname + '/../config.tpl.coffee';
