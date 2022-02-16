var log = require('./logger').create()

var Executor = function (capturedBrowsers, config, emitter) {
var self = this
var executionScheduled = false
var pendingCount = 0
var runningBrowsers

var schedule = function () {
var nonReady = []

if (!capturedBrowsers.length) {
log.warn('No captured browser, open http://%s:%s%s', config.hostname, config.port,
config.urlRoot)
return false
