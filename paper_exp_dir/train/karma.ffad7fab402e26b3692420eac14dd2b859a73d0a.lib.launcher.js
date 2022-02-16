'use strict'

const Jobs = require('qjobs')

const log = require('./logger').create('launcher')

const baseDecorator = require('./launchers/base').decoratorFactory
const captureTimeoutDecorator = require('./launchers/capture_timeout').decoratorFactory
const retryDecorator = require('./launchers/retry').decoratorFactory
const processDecorator = require('./launchers/process').decoratorFactory


const baseBrowserDecoratorFactory = function (
baseLauncherDecorator,
captureTimeoutLauncherDecorator,
retryLauncherDecorator,
processLauncherDecorator,
processKillTimeout
) {
return function (launcher) {
baseLauncherDecorator(launcher)
captureTimeoutLauncherDecorator(launcher)
retryLauncherDecorator(launcher)
processLauncherDecorator(launcher, processKillTimeout)
}
}

class Launcher {
constructor (server, emitter, injector) {
this._server = server
this._emitter = emitter
this._injector = injector
this._browsers = []
this._lastStartTime = null


this.launch.$inject = [
