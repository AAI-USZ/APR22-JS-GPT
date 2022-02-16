var log = require('./logger').create('launcher')

var baseDecorator = require('./launchers/base').decoratorFactory
var captureTimeoutDecorator = require('./launchers/capture_timeout').decoratorFactory
var retryDecorator = require('./launchers/retry').decoratorFactory
var processDecorator = require('./launchers/process').decoratorFactory


var baseBrowserDecoratorFactory = function (baseLauncherDecorator, captureTimeoutLauncherDecorator,
retryLauncherDecorator, processLauncherDecorator) {
return function (launcher) {
baseLauncherDecorator(launcher)
captureTimeoutLauncherDecorator(launcher)
retryLauncherDecorator(launcher)
processLauncherDecorator(launcher)
}
}

var Launcher = function (emitter, injector) {
var browsers = []
var lastStartTime

var getBrowserById = function (id) {
for (var i = 0; i < browsers.length; i++) {
if (browsers[i].id === id) {
return browsers[i]
}
}

return null
}

this.launch = function (names, hostname, port, urlRoot) {
var browser
var url = 'http://' + hostname + ':' + port + urlRoot

lastStartTime = Date.now()

names.forEach(function (name) {
var locals = {
id: ['value', Launcher.generateId()],
name: ['value', name],
baseLauncherDecorator: ['factory', baseDecorator],
captureTimeoutLauncherDecorator: ['factory', captureTimeoutDecorator],
retryLauncherDecorator: ['factory', retryDecorator],
processLauncherDecorator: ['factory', processDecorator],
baseBrowserDecorator: ['factory', baseBrowserDecoratorFactory]
}


if (name.indexOf('/') !== -1) {
name = 'Script'
}

try {
browser = injector.createChild([locals], ['launcher:' + name]).get('launcher:' + name)
} catch (e) {
if (e.message.indexOf('No provider for "launcher:' + name + '"') !== -1) {
log.warn('Can not load "%s", it is not registered!\n  ' +
'Perhaps you are missing some plugin?', name)
} else {
log.warn('Can not load "%s"!\n  ' + e.stack, name)
}

return
}


if (!browser.forceKill) {
browser.forceKill = function () {
