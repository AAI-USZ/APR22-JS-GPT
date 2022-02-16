
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var log = require('./logger').create('config');
var util = require('./util');
var constant = require('./constants');



var parseConfig = function(configFilePath, cliOptions) {


var config = {
port: constant.DEFAULT_PORT,
runnerPort: constant.DEFAULT_RUNNER_PORT,
basePath: '',
files: [],
exclude: [],
logLevel: constant.LOG_INFO,
colors: true,
autoWatch: false,
reporter: 'progress',
singleRun: false,
browsers: [],
proxies: {},
urlRoot: '/'
};

var ADAPTER_DIR = __dirname + '/../adapter';
var configEnv = {

LOG_DISABLE: constant.LOG_DISABLE,
LOG_ERROR:   constant.LOG_ERROR,
LOG_WARN:    constant.LOG_WARN,
LOG_INFO:    constant.LOG_INFO,
LOG_DEBUG:   constant.LOG_DEBUG,
JASMINE: ADAPTER_DIR + '/lib/jasmine.js',
JASMINE_ADAPTER: ADAPTER_DIR + '/jasmine.js',
MOCHA: ADAPTER_DIR + '/lib/mocha.js',
MOCHA_ADAPTER: ADAPTER_DIR + '/mocha.js',
ANGULAR_SCENARIO: ADAPTER_DIR + '/lib/angular-scenario.js',
ANGULAR_SCENARIO_ADAPTER: ADAPTER_DIR + '/angular-scenario.js',

console: console,
require: require
};

try {
vm.runInNewContext(fs.readFileSync(configFilePath), configEnv);
} catch(e) {
