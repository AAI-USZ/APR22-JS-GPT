var readline = require('readline');
var fs = require('fs');
var util = require('util');
var path = require('path');
var glob = require('glob');

var helper = require('./helper');
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


var validateBrowser = function(name) {
var moduleName = 'karma-' + name.toLowerCase().replace('canary', '') + '-launcher';

try {
require(moduleName);
} catch (e) {
log.warn('Missing "%s" plugin.\n  npm install %s --save' + colors.NYAN, moduleName, moduleName);
}


};

var validateFramework = function(name) {
try {
require('karma-' + name);
} catch (e) {
log.warn('Missing "karma-%s" plugin.\n  npm install karma-%s --save' + colors.NYAN, name, name);
}
};

var validateRequireJs = function(useRequire) {
if (useRequire) {
validateFramework('requirejs');
}
};


var questions = [{
id: 'framework',
question: 'Which testing framework do you want to use ?',
hint: 'Press tab to list possible options. Enter to move to the next question.',
options: ['jasmine', 'mocha', 'qunit', ''],
validate: validateFramework
}, {
id: 'requirejs',
question: 'Do you want to use Require.js ?',
hint: 'This will add Require.js plugin.\n' +
'Press tab to list possible options. Enter to move to the next question.',
options: ['no', 'yes'],
validate: validateRequireJs,
boolean: true
}, {
id: 'browsers',
question: 'Do you want to capture a browser automatically ?',
hint: 'Press tab to list possible options. Enter empty string to move to the next question.',
options: ['Chrome', 'ChromeCanary', 'Firefox', 'Safari', 'PhantomJS', 'Opera', 'IE', ''],
validate: validateBrowser,
multiple: true
}, {
id: 'files',
question: 'What is the location of your source and test files ?',
hint: 'You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".\n' +
'Enter empty string to move to the next question.',
multiple: true,
validate: validatePattern
}, {
id: 'exclude',
question: 'Should any of the files included by the previous patterns be excluded ?',
