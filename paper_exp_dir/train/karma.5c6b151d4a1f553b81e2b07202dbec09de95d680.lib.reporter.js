var util = require('util')
var resolve = require('url').resolve
var SourceMapConsumer = require('source-map').SourceMapConsumer
var WeakMap = require('core-js/es6/weak-map')
var _ = require('lodash')

var log = require('./logger').create('reporter')
var MultiReporter = require('./reporters/multi')
var baseReporterDecoratorFactory = require('./reporters/base').decoratorFactory

var createErrorFormatter = function (basePath, emitter, SourceMapConsumer) {
var lastServedFiles = []
