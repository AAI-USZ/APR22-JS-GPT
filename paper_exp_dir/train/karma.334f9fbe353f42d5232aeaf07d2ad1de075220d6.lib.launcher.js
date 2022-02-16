var Promise = require('bluebird')
var Jobs = require('qjobs')

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

var Launcher = function (server, emitter, injector) {
this._browsers = []
var lastStartTime
var self = this

var getBrowserById = function (id) {
for (var i = 0; i < self._browsers.length; i++) {
if (self._browsers[i].id === id) {
return self._browsers[i]
}
}

return null
}

this.launchSingle = function (protocol, hostname, port, urlRoot, upstreamProxy, processKillTimeout) {
var self = this
return function (name) {
name = (name + '').trim();
if (upstreamProxy) {
protocol = upstreamProxy.protocol
hostname = upstreamProxy.hostname
port = upstreamProxy.port
urlRoot = upstreamProxy.path + urlRoot.substr(1)
}
var url = protocol + '//' + hostname + ':' + port + urlRoot

var locals = {
