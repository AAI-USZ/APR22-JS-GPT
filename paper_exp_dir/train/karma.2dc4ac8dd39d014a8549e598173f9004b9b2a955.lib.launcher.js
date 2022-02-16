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
processLauncherDecorator
) {
return function (launcher) {
baseLauncherDecorator(launcher)
captureTimeoutLauncherDecorator(launcher)
retryLauncherDecorator(launcher)
processLauncherDecorator(launcher)
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

this.launchSingle = function (protocol, hostname, port, urlRoot) {
var self = this
return function (name) {
var url = protocol + '//' + hostname + ':' + port + urlRoot

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
var browser = injector.createChild([locals], ['launcher:' + name]).get('launcher:' + name)
} catch (e) {
if (e.message.indexOf('No provider for "launcher:' + name + '"') !== -1) {
log.error('Cannot load browser "%s": it is not registered! ' +
'Perhaps you are missing some plugin?', name)
} else {
log.error('Cannot load browser "%s"!\n  ' + e.stack, name)
}

emitter.emit('load_error', 'launcher', name)
return
}


if (!browser.forceKill) {
browser.forceKill = function () {
var me = this
return new Promise(function (resolve) {
me.kill(resolve)
})
}

browser.restart = function () {
var me = this
this.kill(function () {
me.start(url)
})
}
}

self.jobs.add(function (args, done) {
log.info('Starting browser %s', helper.isDefined(browser.displayName) ? browser.displayName : browser.name)

browser.on('browser_process_failure', function () {
done(browser.error)
})

browser.on('done', function () {


if (browser.error) return

done(null, browser)
})

browser.start(url)
}, [])

self.jobs.run()
self._browsers.push(browser)
}
}

this.launch = function (names, concurrency) {
log.info(
'Launching browser%s %s with %s',
names.length > 1 ? 's' : '',
names.join(', '),
concurrency === Infinity ? 'unlimited concurrency' : 'concurrency ' + concurrency
)
this.jobs = new Jobs({maxConcurrency: concurrency})

var self = this
lastStartTime = Date.now()
