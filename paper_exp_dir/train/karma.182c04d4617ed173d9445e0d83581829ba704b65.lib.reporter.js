'use strict'

const resolve = require('url').resolve
const SourceMapConsumer = require('source-map').SourceMapConsumer
const _ = require('lodash')

const PathUtils = require('./utils/path-utils')
const log = require('./logger').create('reporter')
const MultiReporter = require('./reporters/multi')
const baseReporterDecoratorFactory = require('./reporters/base').decoratorFactory

function createErrorFormatter (config, emitter, SourceMapConsumer) {
const basePath = config.basePath
const urlRoot = config.urlRoot === '/' ? '' : (config.urlRoot || '')
let lastServedFiles = []

emitter.on('file_list_modified', (files) => {
lastServedFiles = files.served
})

const URL_REGEXP = new RegExp('(?:https?:\\/\\/' +
config.hostname + '(?:\\:' + config.port + ')?' + ')?\\/?' +
urlRoot + '\\/?' +
'(base/|absolute)' +
'((?:[A-z]\\:)?[^\\?\\s\\:]*)' +
'(\\?\\w*)?' +
'(\\:(\\d+))?' +
'(\\:(\\d+))?' +
'', 'g')

const cache = new WeakMap()

function getSourceMapConsumer (sourceMap) {
if (!cache.has(sourceMap)) {
cache.set(sourceMap, new SourceMapConsumer(sourceMap))
}
return cache.get(sourceMap)
}

return function (input, indentation) {
indentation = _.isString(indentation) ? indentation : ''
if (_.isError(input)) {
input = input.message
} else if (_.isEmpty(input)) {
input = ''
} else if (!_.isString(input)) {
input = JSON.stringify(input, null, indentation)
}

let msg = input.replace(URL_REGEXP, function (_, prefix, path, __, ___, line, ____, column) {
const normalizedPath = prefix === 'base/' ? `${basePath}/${path}` : path
const file = lastServedFiles.find((file) => file.path === normalizedPath)

if (file && file.sourceMap && line) {
line = +line
column = +column



const bias = column ? SourceMapConsumer.GREATEST_LOWER_BOUND : SourceMapConsumer.LEAST_UPPER_BOUND

try {
const zeroBasedColumn = Math.max(0, (column || 1) - 1)
const original = getSourceMapConsumer(file.sourceMap).originalPositionFor({ line, column: zeroBasedColumn, bias })



const oneBasedOriginalColumn = original.column == null ? original.column : original.column + 1
return `${PathUtils.formatPathMapping(resolve(path, original.source), original.line, oneBasedOriginalColumn)} <- ${PathUtils.formatPathMapping(path, line, column)}`
} catch (e) {
log.warn(`SourceMap position not found for trace: ${input}`)
}
}

