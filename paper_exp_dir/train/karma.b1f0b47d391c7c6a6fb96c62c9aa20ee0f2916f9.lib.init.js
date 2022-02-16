var readline = require('readline');
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
var formatters = require('./init/formatters');







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

exec('npm install ' + pkgName + ' --save-dev', options, function(err, stdout, stderr) {


logQueue.push(function() {
if (!err) {
log.debug('%s successfully installed.', pkgName);
} else if (/is not in the npm registry/.test(stderr)) {
log.warn('Failed to install "%s". It is not in the NPM registry!\n' +
'  Please install it manually.', pkgName);
} else if (/Error: EACCES/.test(stderr)) {
log.warn('Failed to install "%s". No permissions to write in %s!\n' +
'  Please install it manually.', pkgName, options.cwd);
} else {
log.warn('Failed to install "%s"\n  Please install it manually.', pkgName);
}
});
});
};


var validatePattern = function(pattern) {
if (!glob.sync(pattern).length) {
log.warn('There is no file matching this pattern.\n');
}
};

var validateBrowser = function(name) {

installPackage('karma-' + name.toLowerCase().replace('canary', '') + '-launcher');
};

var validateFramework = function(name) {
installPackage('karma-' + name);
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
options: ['jasmine', 'mocha', 'qunit', 'nodeunit', 'nunit', ''],
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
question: 'Do you want to capture any browsers automatically ?',
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
hint: 'You can use glob patterns, eg. "**/*.swp".\n' +
'Enter empty string to move to the next question.',
multiple: true,
validate: validatePattern
}, {
id: 'generateTestMain',
question: 'Do you wanna generate a bootstrap file for RequireJS?',
hint: 'This will generate test-main.js/coffee that configures RequiseJS and starts the tests.',
options: ['no', 'yes'],
boolean: true,
condition: function(answers) {
return answers.requirejs;
}
}, {
id: 'includedFiles',
question: 'Which files do you want to include with <script> tag ?',
hint: 'This should be a script that bootstraps your test by configuring Require.js and ' +
'kicking __karma__.start(), probably your test-main.js file.\n' +
'Enter empty string to move to the next question.',
multiple: true,
