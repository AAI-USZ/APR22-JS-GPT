var readline = require('readline');
var fs = require('fs');
var util = require('util');
var path = require('path');
var glob = require('glob');

var helper = require('./helper');
var launcher = require('./launcher');
var logger = require('./logger');
var constant = require('./constants');

var log = logger.create('init');

var CONFIG_TPL_PATH = __dirname + '/../config.template';


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


var validateBrowser = function(value) {
var proto = launcher[value + 'Browser'].prototype;
var defaultCmd = proto.DEFAULT_CMD[process.platform];
var envCmd = process.env[proto.ENV_CMD];

if (!fs.existsSync(defaultCmd) && (!envCmd || !fs.existsSync(envCmd))) {
log.warn('No binary for %s.\n  Create symlink at "%s", or set "%s" env variable.\n' +
colors.NYAN, value, defaultCmd, proto.ENV_CMD);
}
};


var questions = [{
id: 'framework',
question: 'Which testing framework do you want to use ?',
hint: 'Press tab to list possible options. Enter to move to the next question.',
options: ['jasmine', 'mocha', 'qunit', '']
