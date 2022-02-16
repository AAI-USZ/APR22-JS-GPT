var util = require('util')
var resolve = require('url').resolve
var SourceMapConsumer = require('source-map').SourceMapConsumer
var WeakMap = require('core-js/es6/weak-map')
var _ = require('lodash')

var log = require('./logger').create('reporter')
var MultiReporter = require('./reporters/multi')
var baseReporterDecoratorFactory = require('./reporters/base').decoratorFactory

var createErrorFormatter = function (config, emitter, SourceMapConsumer) {
var basePath = config.basePath
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

var URL_REGEXP = new RegExp('(?:https?:\\/\\/' +
config.hostname + '(?:\\:' + config.port + ')?' + ')?\\/?' +
'(base/|absolute)' +
'((?:[A-z]\\:)?[^\\?\\s\\:]*)' +
'(\\?\\w*)?' +
'(\\:(\\d+))?' +
'(\\:(\\d+))?' +
'', 'g')

var getSourceMapConsumer = (function () {
var cache = new WeakMap()
