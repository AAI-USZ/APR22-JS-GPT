var helper = require('./helper');
var log = require('./logger').create('reporter');
var MultiReporter = require('./reporters/Multi');
var baseReporterDecoratorFactory = require('./reporters/Base').decoratorFactory;

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

createErrorFormatter.$inject = ['config.basePath', 'config.urlRoot'];


var createReporters = function(names, config, emitter, injector) {
var errorFormatter = createErrorFormatter(config.basePath, config.urlRoot);
var reporters = [];


names.forEach(function(name) {
