var log = require('./logger').create()

var Executor = function (capturedBrowsers, config, emitter) {
var self = this
var executionScheduled = false
var pendingCount = 0
var runningBrowsers

var schedule = function () {
var nonReady = []

if (!capturedBrowsers.length) {
log.warn('No captured browser, open %s//%s:%s%s', config.protocol, config.hostname,
config.port, config.urlRoot)
return false
}

if (capturedBrowsers.areAllReady(nonReady)) {
log.debug('All browsers are ready, executing')
log.debug('Captured %s browsers', capturedBrowsers.length)
executionScheduled = false
capturedBrowsers.clearResults()
capturedBrowsers.setAllToExecuting()
pendingCount = capturedBrowsers.length
runningBrowsers = capturedBrowsers.clone()
emitter.emit('run_start', runningBrowsers)
self.socketIoSockets.emit('execute', config.client)
return true
}
