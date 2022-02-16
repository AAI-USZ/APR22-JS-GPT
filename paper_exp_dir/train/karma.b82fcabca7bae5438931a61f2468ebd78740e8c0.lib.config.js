
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
autoWatchInterval: 0,
reporter: 'progress',
singleRun: false,
browsers: []
};

var configEnv = {

LOG_DISABLE: constant.LOG_DISABLE,
LOG_ERROR:   constant.LOG_ERROR,
LOG_WARN:    constant.LOG_WARN,
LOG_INFO:    constant.LOG_INFO,
LOG_DEBUG:   constant.LOG_DEBUG,
JASMINE: __dirname + '/../adapter/lib/jasmine.js',
JASMINE_ADAPTER: __dirname + '/../adapter/jasmine.js',


console: console,
require: require
};

try {
vm.runInNewContext(fs.readFileSync(configFilePath), configEnv);
} catch(e) {
if (e.name === 'SyntaxError') {
log.error('Syntax error in config file!\n' + e.message);
} else if (e.code === 'ENOENT' || e.code === 'EISDIR') {
log.error('Config file does not exist!');
} else {
log.error('Invalid config file!\n', e);
}

process.exit(1);
}


Object.getOwnPropertyNames(config).forEach(function(key) {
if (configEnv.hasOwnProperty(key)) {
config[key] = configEnv[key];
}
});


config = util.merge(config, cliOptions || {});


config.basePath = path.resolve(path.dirname(configFilePath), config.basePath);

var basePathResolve = function(relativePath) {
if (util.isUrlAbsolute(relativePath)) return relativePath;
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

return config;
};



exports.parseConfig = parseConfig;
