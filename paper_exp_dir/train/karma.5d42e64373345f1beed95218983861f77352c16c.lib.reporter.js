var util = require('util');
var log = require('./logger').create('reporter');
var MultiReporter = require('./reporters/multi');
var baseReporterDecoratorFactory = require('./reporters/base').decoratorFactory;
var SourceMapConsumer = require('source-map').SourceMapConsumer;

var createErrorFormatter = function(basePath, emitter, SourceMapConsumer) {
var lastServedFiles = [];

emitter.on('file_list_modified', function(filesPromise) {
filesPromise.then(function(files) {
lastServedFiles = files.served;
});
});

var findFile = function(path) {
for (var i = 0; i < lastServedFiles.length; i++) {
if (lastServedFiles[i].path === path) {
return lastServedFiles[i];
}
}
return null;
};

var URL_REGEXP = new RegExp('http:\\/\\/[^\\/]*\\/' +
'(base|absolute)' +
'((?:[A-z]\\:)?[^\\?\\s\\:]*)' +
'(\\?\\w*)?' +
'(\\:(\\d+))?' +
'(\\:(\\d+))?' +
'', 'g');

return function(msg, indentation) {


msg = (msg || '').replace(URL_REGEXP, function(_, prefix, path, __, ___, line, ____, column) {

if (prefix === 'base') {
path = basePath + path;
}

var file = findFile(path);

if (file && file.sourceMap) {
line = parseInt(line || '0', 10);
column = parseInt(column || '0', 10);

var smc = new SourceMapConsumer(file.sourceMap);
try {
var original = smc.originalPositionFor({line: line, column: column});

return util.format('%s:%d:%d <- %s:%d:%d', path, line, column, original.source,
original.line, original.column);
} catch (e) {
log.warn('SourceMap position not found for trace: %s', msg);

}
}
