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
