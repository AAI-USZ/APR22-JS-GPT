var log = require('./logger').create('launcher')
var q = require('q')

var baseDecorator = require('./launchers/base').decoratorFactory
var captureTimeoutDecorator = require('./launchers/capture_timeout').decoratorFactory
var retryDecorator = require('./launchers/retry').decoratorFactory
var processDecorator = require('./launchers/process').decoratorFactory


var baseBrowserDecoratorFactory = function (baseLauncherDecorator, captureTimeoutLauncherDecorator,
retryLauncherDecorator, processLauncherDecorator) {
return function (launcher) {
baseLauncherDecorator(launcher)
