
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var coffee = require('coffee-script');
var log = require('./logger').create('config');
var util = require('./util');
var constant = require('./constants');


var Pattern = function(pattern, served, included, watched) {
this.pattern = pattern;
this.served = util.isDefined(served) ? served : true;
this.included = util.isDefined(included) ? included : true;
this.watched = util.isDefined(watched) ? watched : true;
};


var createPatternObject = function(pattern) {
if (util.isString(pattern)) {
return util.isUrlAbsolute(pattern) ?
new Pattern(pattern, false, true, false) :
new Pattern(pattern);
}

if (util.isObject(pattern)) {
if (!util.isDefined(pattern.pattern)) {
log.warn('Invalid pattern %s!\n\tObject is missing "pattern" property".', pattern);
}

return util.isUrlAbsolute(pattern.pattern) ?
new Pattern(pattern.pattern, false, true, false) :
new Pattern(pattern.pattern, pattern.served, pattern.included, pattern.watched);
}

log.warn('Invalid pattern %s!\n\tExpected string or object with "pattern" property.', pattern);
return new Pattern(null, false, false, false);
};


var normalizeConfig = function(config) {

var basePathResolve = function(relativePath) {
if (util.isUrlAbsolute(relativePath)) {
return relativePath;
}

return path.resolve(config.basePath, relativePath);
};

var createPatternMapper = function(resolve) {
return function(objectPattern) {
objectPattern.pattern = resolve(objectPattern.pattern);

return objectPattern;
};
};

config.files = config.files.map(createPatternObject).map(createPatternMapper(basePathResolve));
config.exclude = config.exclude.map(basePathResolve);
config.junitReporter.outputFile = basePathResolve(config.junitReporter.outputFile);
config.coverageReporter.dir = basePathResolve(config.coverageReporter.dir);


config.basePath = util.normalizeWinPath(config.basePath);
config.files = config.files.map(createPatternMapper(util.normalizeWinPath));
config.exclude = config.exclude.map(util.normalizeWinPath);
config.junitReporter.outputFile = util.normalizeWinPath(config.junitReporter.outputFile);
config.coverageReporter.dir = util.normalizeWinPath(config.coverageReporter.dir);


var urlRoot = config.urlRoot;
