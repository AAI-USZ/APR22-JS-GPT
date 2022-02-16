'use strict'

const Promise = require('bluebird')
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

function Launcher (server, emitter, injector) {
this._browsers = []
let lastStartTime

const getBrowserById = (id) => this._browsers.find((browser) => browser.id === id)

this.launchSingle = (protocol, hostname, port, urlRoot, upstreamProxy, processKillTimeout) => {
if (upstreamProxy) {
protocol = upstreamProxy.protocol
hostname = upstreamProxy.hostname
port = upstreamProxy.port
urlRoot = upstreamProxy.path + urlRoot.substr(1)
}

return (name) => {
let browser
const locals = {
id: ['value', Launcher.generateId()],
name: ['value', name],
processKillTimeout: ['value', processKillTimeout],
baseLauncherDecorator: ['factory', baseDecorator],
captureTimeoutLauncherDecorator: ['factory', captureTimeoutDecorator],
retryLauncherDecorator: ['factory', retryDecorator],
processLauncherDecorator: ['factory', processDecorator],
baseBrowserDecorator: ['factory', baseBrowserDecoratorFactory]
