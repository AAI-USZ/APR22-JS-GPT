
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var coffee = require('coffee-script');
var log = require('./logger').create('config');
var util = require('./util');
var constant = require('./constants');


var normalizeConfig = function(config) {

var basePathResolve = function(relativePath) {
if (util.isUrlAbsolute(relativePath)) {
return relativePath;
}

return path.resolve(config.basePath, relativePath);
};

config.files = config.files.map(basePathResolve);
config.exclude = config.exclude.map(basePathResolve);

var normalizeWinPath = function(path) {
return path.replace(/\\/g, '/');
};


config.basePath = util.normalizeWinPath(config.basePath);
config.files = config.files.map(util.normalizeWinPath);
config.exclude = config.exclude.map(util.normalizeWinPath);


var urlRoot = config.urlRoot;
if (urlRoot.charAt(0) !== '/') {
urlRoot = '/' + urlRoot;
}

if (urlRoot.charAt(urlRoot.length - 1) !== '/') {
urlRoot = urlRoot + '/';
}

if (urlRoot !== config.urlRoot) {
log.warn('urlRoot normalized to "%s"', urlRoot);
config.urlRoot = urlRoot;
}

if (config.singleRun && config.autoWatch) {
log.debug('autoWatch set to false, because of singleRun');
config.autoWatch = false;
}

if (util.isString(config.reporters)) {
config.reporters = config.reporters.split(',');
}


if (util.isDefined(config.reporter)) {
log.warn('"reporter" is deprecated, use "reporters" instead');
}

return config;
};


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
reporters: ['progress'],
singleRun: false,
browsers: [],
captureTimeout: 60000,
proxies: {},
preprocessors: {'**/*.coffee': 'coffee'},
urlRoot: '/',
reportSlowerThan: 0,
junitReporter: {
outputFile: 'test-results.xml',
suite: ''
}
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
require: require,
process: process,
__filename: configFilePath,
__dirname: path.dirname(configFilePath)
};

try {
var configSrc = fs.readFileSync(configFilePath);


if (path.extname(configFilePath) === '.coffee') {
configSrc = coffee.compile(configSrc.toString(), {bare: true});
