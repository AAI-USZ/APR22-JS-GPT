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
if (helper.isString(pattern)) {
return helper.isUrlAbsolute(pattern) ? new UrlPattern(pattern) : new Pattern(pattern);
}

if (helper.isObject(pattern)) {
if (!helper.isDefined(pattern.pattern)) {
log.warn('Invalid pattern %s!\n\tObject is missing "pattern" property".', pattern);
}

return helper.isUrlAbsolute(pattern.pattern) ?
new UrlPattern(pattern.pattern) :
new Pattern(pattern.pattern, pattern.served, pattern.included, pattern.watched);
}

log.warn('Invalid pattern %s!\n\tExpected string or object with "pattern" property.', pattern);
return new Pattern(null, false, false, false);
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
config.junitReporter.outputFile = basePathResolve(config.junitReporter.outputFile);
config.coverageReporter.dir = basePathResolve(config.coverageReporter.dir);


config.basePath = helper.normalizeWinPath(config.basePath);
config.files = config.files.map(createPatternMapper(helper.normalizeWinPath));
config.exclude = config.exclude.map(helper.normalizeWinPath);
config.junitReporter.outputFile = helper.normalizeWinPath(config.junitReporter.outputFile);
config.coverageReporter.dir = helper.normalizeWinPath(config.coverageReporter.dir);


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

if (config.proxies && config.proxies.hasOwnProperty(config.urlRoot)) {
log.warn('"%s" is proxied, you should probably change urlRoot to avoid conflicts',
config.urlRoot);
}

if (config.singleRun && config.autoWatch) {
log.debug('autoWatch set to false, because of singleRun');
config.autoWatch = false;
}

if (helper.isString(config.reporters)) {
config.reporters = config.reporters.split(',');
}


if (helper.isDefined(config.reporter)) {
log.warn('"reporter" is deprecated, use "reporters" instead');
}


var preprocessors = config.preprocessors || {};
var normalizedPreprocessors = config.preprocessors = Object.create(null);

Object.keys(preprocessors).forEach(function(pattern) {
var normalizedPattern = helper.normalizeWinPath(basePathResolve(pattern));

normalizedPreprocessors[normalizedPattern] = helper.isString(preprocessors[pattern]) ?
[preprocessors[pattern]] : preprocessors[pattern];
});



var module = Object.create(null);
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
});
});

config.plugins.push(module);

return config;
};


var CONFIG_SYNTAX_FRAMEWORKS_HELP = '  module.exports = function(config) {\n' +
'    config.set({\n' +
'      // your config\n' +
'      frameworks: ["%s"]\n' +
'    });\n' +
'  };\n';

var CONST_ERR = '%s is not supported anymore. Please use:\n'+CONFIG_SYNTAX_FRAMEWORKS_HELP;
['JASMINE', 'MOCHA', 'QUNIT'].forEach(function(framework) {
[framework, framework + '_ADAPTER'].forEach(function(name) {
