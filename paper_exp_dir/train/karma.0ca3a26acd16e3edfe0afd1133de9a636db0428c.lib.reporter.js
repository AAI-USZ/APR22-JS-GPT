'use strict'

const resolve = require('url').resolve
const SourceMapConsumer = require('source-map').SourceMapConsumer
const _ = require('lodash')

const PathUtils = require('./utils/path-utils')
const log = require('./logger').create('reporter')
const MultiReporter = require('./reporters/multi')
const baseReporterDecoratorFactory = require('./reporters/base').decoratorFactory
