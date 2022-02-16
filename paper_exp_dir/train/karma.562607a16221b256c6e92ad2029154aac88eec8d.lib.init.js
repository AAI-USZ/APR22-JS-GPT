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
hint: 'This will add Require.js adapter into files.\n' +
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
id: 'includedFiles',
question: 'Which files do you want to include with <script> tag ?',
hint: 'This should be a script that bootstraps your test by configuring Require.js and ' +
'kicking __karma__.start()\n' +
'You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".\n' +
'Enter empty string to move to the next question.',
multiple: true,
validate: validatePattern,
condition: function(answers) {return answers.requirejs;}
}, {
id: 'files',
question: 'Which files do you want to test ?',
hint: 'You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".\n' +
'Enter empty string to move to the next question.',
multiple: true,
validate: validatePattern
}, {
id: 'exclude',
question: 'Any files you want to exclude ?',
hint: 'You can use glob patterns, eg. "**/*.swp".\n' +
'Enter empty string to move to the next question.',
multiple: true,
validate: validatePattern
}, {
id: 'autoWatch',
question: 'Do you want Karma to watch all the files and run the tests on change ?',
hint: 'Press tab to list possible options.',
options: ['yes', 'no'],
boolean: true
}];



var StateMachine = function(rli) {
var currentQuestion;
var answers;
var currentOptions;
var currentOptionsPointer;
var pendingQuestionId;
var done;

this.onKeypress = function(key) {
if (!currentOptions || !key) {
return;
}

if (key.name === 'tab' || key.name === 'right' || key.name === 'down') {
this.suggestNextOption();
} else if (key.name === 'left' || key.name === 'up') {
currentOptionsPointer = currentOptionsPointer + currentOptions.length - 2;
this.suggestNextOption();
}

if (!key.ctrl && !key.meta && key.name !== 'enter' && key.name !== 'return') {
key.name = 'escape';
}
};

this.suggestNextOption = function() {
if (!currentOptions) {
return;
}

currentOptionsPointer = (currentOptionsPointer + 1) % currentOptions.length;
rli._deleteLineLeft();
rli._deleteLineRight();
rli.write(currentOptions[currentOptionsPointer]);
};


this.onLine = function(line) {
if (pendingQuestionId) {
if (currentOptions) {
currentOptionsPointer = currentOptions.indexOf(line);
if (currentOptionsPointer === -1) {
return;
}
}

if (line === '') {
line = null;
}

if (currentQuestion.boolean) {
line = (line === 'yes' || line === 'true' || line === 'on');
}

if (line !== null && currentQuestion.validate) {
currentQuestion.validate(line);
}

if (currentQuestion.multiple) {
answers[pendingQuestionId] = answers[pendingQuestionId] || [];
if (line !== null) {
answers[pendingQuestionId].push(line);
