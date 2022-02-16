var path = require('path');

var logger = require('./logger');
var log = logger.create('config');
var helper = require('./helper');
var constant = require('./constants');



require('coffee-script');


var Pattern = function(pattern, served, included, watched) {
this.pattern = pattern;
this.served = helper.isDefined(served) ? served : true;
this.included = helper.isDefined(included) ? included : true;
this.watched = helper.isDefined(watched) ? watched : true;
};

var UrlPattern = function(url) {
Pattern.call(this, url, false, true, false);
};


var createPatternObject = function(pattern) {
if (pattern && helper.isString(pattern)) {
return helper.isUrlAbsolute(pattern) ? new UrlPattern(pattern) : new Pattern(pattern);
}

if (helper.isObject(pattern)) {
if (pattern.pattern && helper.isString(pattern.pattern)) {
return helper.isUrlAbsolute(pattern.pattern) ?
new UrlPattern(pattern.pattern) :
new Pattern(pattern.pattern, pattern.served, pattern.included, pattern.watched);
}

log.warn('Invalid pattern %s!\n\tObject is missing "pattern" property.', pattern);
return new Pattern(null, false, false, false);
}

log.warn('Invalid pattern %s!\n\tExpected string or object with "pattern" property.', pattern);
return new Pattern(null, false, false, false);
};


var normalizeUrlRoot = function(urlRoot) {
var normalizedUrlRoot = urlRoot;

if (normalizedUrlRoot.charAt(0) !== '/') {
normalizedUrlRoot = '/' + normalizedUrlRoot;
}

if (normalizedUrlRoot.charAt(normalizedUrlRoot.length - 1) !== '/') {
normalizedUrlRoot = normalizedUrlRoot + '/';
}

if (normalizedUrlRoot !== urlRoot) {
log.warn('urlRoot normalized to "%s"', normalizedUrlRoot);
}

return normalizedUrlRoot;
};

var normalizeConfig = function(config, configFilePath) {

var basePathResolve = function(relativePath) {
if (helper.isUrlAbsolute(relativePath)) {
return relativePath;
}

if (!helper.isDefined(config.basePath) || !helper.isDefined(relativePath)) {
return '';
}
return path.resolve(config.basePath, relativePath);
};

var createPatternMapper = function(resolve) {
return function(objectPattern) {
objectPattern.pattern = resolve(objectPattern.pattern);

return objectPattern;
};
};

if (helper.isString(configFilePath)) {

config.basePath = path.resolve(path.dirname(configFilePath), config.basePath);


config.exclude.push(configFilePath);
} else {
config.basePath = path.resolve(config.basePath || '.');
}

config.files = config.files.map(createPatternObject).map(createPatternMapper(basePathResolve));
config.exclude = config.exclude.map(basePathResolve);


config.basePath = helper.normalizeWinPath(config.basePath);
config.files = config.files.map(createPatternMapper(helper.normalizeWinPath));
config.exclude = config.exclude.map(helper.normalizeWinPath);


config.urlRoot = normalizeUrlRoot(config.urlRoot);

if (config.proxies && config.proxies.hasOwnProperty(config.urlRoot)) {
log.warn('"%s" is proxied, you should probably change urlRoot to avoid conflicts',
config.urlRoot);
}

if (config.singleRun && config.autoWatch) {
log.debug('autoWatch set to false, because of singleRun');
config.autoWatch = false;
}

if (!config.singleRun && config.browserDisconnectTolerance) {
log.debug('browserDisconnectTolerance set to 0, because of singleRun');
config.browserDisconnectTolerance = 0;
}

if (helper.isString(config.reporters)) {
config.reporters = config.reporters.split(',');
}


var preprocessors = config.preprocessors || {};
var normalizedPreprocessors = config.preprocessors = Object.create(null);

Object.keys(preprocessors).forEach(function(pattern) {
var normalizedPattern = helper.normalizeWinPath(basePathResolve(pattern));

normalizedPreprocessors[normalizedPattern] = helper.isString(preprocessors[pattern]) ?
[preprocessors[pattern]] : preprocessors[pattern];
});



var module = Object.create(null);
var hasSomeInlinedPlugin = false;
['launcher', 'preprocessor', 'reporter'].forEach(function(type) {
var definitions = config['custom' + helper.ucFirst(type) + 's'] || {};

Object.keys(definitions).forEach(function(name) {
var definition = definitions[name];

if (!helper.isObject(definition)) {
return log.warn('Can not define %s %s. Definition has to be an object.', type, name);
}

if (!helper.isString(definition.base)) {
return log.warn('Can not define %s %s. Missing base %s.', type, name, type);
}

var token = type + ':' + definition.base;
var locals = {
args: ['value', definition]
};

module[type + ':' + name] = ['factory', function(injector) {
return injector.createChild([locals], [token]).get(token);
}];
hasSomeInlinedPlugin = true;
});
});

if (hasSomeInlinedPlugin) {
config.plugins.push(module);
}

return config;
};

var Config = function() {
var config = this;

this.LOG_DISABLE = constant.LOG_DISABLE;
this.LOG_ERROR = constant.LOG_ERROR;
this.LOG_WARN = constant.LOG_WARN;
this.LOG_INFO = constant.LOG_INFO;
this.LOG_DEBUG = constant.LOG_DEBUG;

this.set = function(newConfig) {
Object.keys(newConfig).forEach(function(key) {
config[key] = newConfig[key];
});
};


this.frameworks = [];
this.port = constant.DEFAULT_PORT;
this.hostname = constant.DEFAULT_HOSTNAME;
this.basePath = '';
this.files = [];
this.exclude = [];
this.logLevel = constant.LOG_INFO;
this.colors = true;
this.autoWatch = true;
this.autoWatchBatchDelay = 250;
this.usePolling = true;
this.reporters = ['progress'];
this.singleRun = false;
this.browsers = [];
this.captureTimeout = 60000;
this.proxies = {};
this.proxyValidateSSL = true;
this.preprocessors = {'**/*.coffee': 'coffee', '**/*.html': 'html2js'};
this.urlRoot = '/';
this.reportSlowerThan = 0;
this.loggers = [constant.CONSOLE_APPENDER];
this.transports = ['websocket', 'flashsocket', 'xhr-polling', 'jsonp-polling'];
this.plugins = ['karma-*'];
this.client = {
args: []
};
this.browserDisconnectTimeout = 2000;
this.browserDisconnectTolerance = 0;
this.browserNoActivityTimeout = 10000;
};

var CONFIG_SYNTAX_HELP = '  module.exports = function(config) {\n' +
'    config.set({\n' +
'      // your config\n' +
'    });\n' +
'  };\n';

var parseConfig = function(configFilePath, cliOptions) {