var util = require('util')
var resolve = require('url').resolve
var SourceMapConsumer = require('source-map').SourceMapConsumer
var _ = require('lodash')

var log = require('./logger').create('reporter')
var MultiReporter = require('./reporters/multi')
var baseReporterDecoratorFactory = require('./reporters/base').decoratorFactory

var createErrorFormatter = function (config, emitter, SourceMapConsumer) {
var basePath = config.basePath
var lastServedFiles = []

