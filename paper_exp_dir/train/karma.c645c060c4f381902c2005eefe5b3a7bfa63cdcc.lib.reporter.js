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
if (['dots', 'progress'].indexOf(name) !== -1) {
var Cls = require('./reporters/' + helper.ucFirst(name) + (config.colors ? 'Color' : ''));
return reporters.push(new Cls(errorFormatter, config.reportSlowerThan));
}

var locals = {
baseReporterDecorator: ['factory', baseReporterDecoratorFactory],
formatError: ['factory', createErrorFormatter]
};

try {
reporters.push(injector.createChild([locals], ['reporter:' + name]).get('reporter:' + name));
} catch(e) {
if (e.message.indexOf('No provider for "reporter:' + name + '"') !== -1) {
log.warn('Can not load "%s", it is not registered!\n  ' +
'Perhaps you are missing some plugin?', name);
} else {
log.warn('Can not load "%s"!\n  ' + e.stack, name);
}
}
});


reporters.forEach(function(reporter) {
emitter.bind(reporter);
