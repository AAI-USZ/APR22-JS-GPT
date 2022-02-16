var util = require('util')
var log = require('./logger').create('reporter')
var MultiReporter = require('./reporters/multi')
var baseReporterDecoratorFactory = require('./reporters/base').decoratorFactory
var SourceMapConsumer = require('source-map').SourceMapConsumer
var memoizeWeak = require('memoizee/weak')

var createErrorFormatter = function (basePath, emitter, SourceMapConsumer) {
var lastServedFiles = []

emitter.on('file_list_modified', function (files) {
lastServedFiles = files.served
})

var findFile = function (path) {
for (var i = 0; i < lastServedFiles.length; i++) {
if (lastServedFiles[i].path === path) {
return lastServedFiles[i]
}
}
return null
}

var URL_REGEXP = new RegExp('(?:https?:\\/\\/[^\\/]*)?\\/?' +
'(base|absolute)' +
'((?:[A-z]\\:)?[^\\?\\s\\:]*)' +
'(\\?\\w*)?' +
'(\\:(\\d+))?' +
'(\\:(\\d+))?' +
'', 'g')

var getSourceMapConsumer = memoizeWeak(function (sourceMap) {
return new SourceMapConsumer(sourceMap)
})

return function (msg, indentation) {


msg = (msg || '').replace(URL_REGEXP, function (_, prefix, path, __, ___, line, ____, column) {
if (prefix === 'base') {
path = basePath + path
}

var file = findFile(path)

if (file && file.sourceMap) {
line = parseInt(line || '0', 10)

column = parseInt(column, 10)



var bias = column ? SourceMapConsumer.GREATEST_LOWER_BOUND : SourceMapConsumer.LEAST_UPPER_BOUND

try {
var original = getSourceMapConsumer(file.sourceMap)
.originalPositionFor({line: line, column: (column || 0), bias: bias})
