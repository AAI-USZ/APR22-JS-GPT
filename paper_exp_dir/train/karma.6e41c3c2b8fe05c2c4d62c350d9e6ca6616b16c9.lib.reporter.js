var u = require('./util');
var log = require('./logger').create('reporter');

var MultiReporter = require('./reporters/Multi');


var createErrorFormatter = function(basePath, urlRoot) {
var URL_REGEXP = new RegExp('http:\\/\\/[^\\/]*' + urlRoot.replace(/\
'(base|absolute)([^\\?\\s]*)(\\?[0-9]*)?', 'g');

return function(msg, indentation) {


msg = msg.replace(URL_REGEXP, function(full, prefix, path) {
if (prefix === 'base') {
return basePath + path;
} else if (prefix === 'absolute') {
return path;
}
});


if (indentation) {
msg = indentation + msg.replace(/\n/g, '\n' + indentation);
}

return msg + '\n';
};
};

var createReporters = function(names, config, emitter) {
var errorFormatter = createErrorFormatter(config.basePath, config.urlRoot);
var multiReporter = new MultiReporter();

names.forEach(function(name) {
if (name === 'junit') {
return multiReporter.reporters.push(new exports.JUnit(errorFormatter,
config.junitReporter.outputFile, config.junitReporter.suite, emitter));
}

var Reporter = exports[u.ucFirst(name) + (config.colors ? 'Color' : '')];
if (Reporter) {
var reporter = new Reporter(errorFormatter, config.reportSlowerThan);
return multiReporter.reporters.push(reporter);
