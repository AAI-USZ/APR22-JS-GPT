var readline = require('readline');
var fs = require('fs');
var util = require('util');
var path = require('path');
var glob = require('glob');

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

var validatePattern = function(value) {
if (!glob.sync(value).length) {
log.warn('There is no file matching this pattern.\n' + colors.NYAN);
}
};


var validateBrowser = function(name) {
var moduleName = 'karma-' + name.toLowerCase().replace('canary', '') + '-launcher';

try {
require(moduleName);
} catch (e) {
log.warn('Missing "%s" plugin.\n  npm install %s --save-dev' + colors.NYAN, moduleName,
moduleName);
}


};

var validateFramework = function(name) {
try {
require('karma-' + name);
} catch (e) {
