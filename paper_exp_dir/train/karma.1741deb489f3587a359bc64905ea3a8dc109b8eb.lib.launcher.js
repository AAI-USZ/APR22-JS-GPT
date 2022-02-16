var Promise = require('bluebird')
var Batch = require('batch')

var log = require('./logger').create('launcher')

var baseDecorator = require('./launchers/base').decoratorFactory
var captureTimeoutDecorator = require('./launchers/capture_timeout').decoratorFactory
var retryDecorator = require('./launchers/retry').decoratorFactory
var processDecorator = require('./launchers/process').decoratorFactory


