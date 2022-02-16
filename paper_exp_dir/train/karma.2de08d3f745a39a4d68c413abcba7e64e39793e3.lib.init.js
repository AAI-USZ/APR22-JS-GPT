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
return this.BOLD + str + '\x1B[22m';
},
green: function(str) {
return this.GREEN + str + this.END;
}
};


var colors = COLORS_ON;

var COLORS_OFF = {
END: '',
NYAN: '',
GREEN: '',
BOLD: '',
bold: function(str) {
return str;
},
green: function(str) {
return str;
}
};

var logQueue = [];

var printLogQueue = function() {
while (logQueue.length) {
logQueue.shift()();
}
};

var NODE_MODULES_DIR = path.resolve(__dirname, '../..');



if (!/node_modules$/.test(NODE_MODULES_DIR)) {
NODE_MODULES_DIR = path.resolve('node_modules');
}

var installPackage = function(pkgName) {

try {
require(NODE_MODULES_DIR + '/' + pkgName);
return;
} catch (e) {}

log.debug('Missing plugin "%s". Installing...', pkgName);

var options = {
cwd: path.resolve(NODE_MODULES_DIR, '..')
};

