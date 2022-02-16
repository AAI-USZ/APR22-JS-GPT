var Promise = require('bluebird')
var Batch = require('batch')

var helper = require('./helper')
var log = require('./logger').create('launcher')

var baseDecorator = require('./launchers/base').decoratorFactory
var captureTimeoutDecorator = require('./launchers/capture_timeout').decoratorFactory
var retryDecorator = require('./launchers/retry').decoratorFactory
var processDecorator = require('./launchers/process').decoratorFactory


var baseBrowserDecoratorFactory = function (
baseLauncherDecorator,
captureTimeoutLauncherDecorator,
retryLauncherDecorator,
processLauncherDecorator
) {
return function (launcher) {
baseLauncherDecorator(launcher)
captureTimeoutLauncherDecorator(launcher)
retryLauncherDecorator(launcher)
