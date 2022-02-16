var stringify = require('./stringify')
var constant = require('./constants')
var util = require('./util')

var Karma = function (socket, iframe, opener, navigator, location) {
var hasError = false
var startEmitted = false
var reloadingContext = false
var store = {}
var self = this
var queryParams = util.parseQueryParams(location.search)
var browserId = queryParams.id || util.generateId('manual-')
var returnUrl = queryParams['return_url' + ''] || null

var resultsBufferLimit = 50
var resultsBuffer = []

this.VERSION = constant.VERSION
this.config = {}



this.socket = socket

var childWindow = null
var navigateContextTo = function (url) {
if (self.config.useIframe === false) {
if (childWindow === null || childWindow.closed === true) {

childWindow = opener('about:blank')
}
childWindow.location = url
} else {
iframe.src = url
}
}

this.setupContext = function (contextWindow) {
if (self.config.clearContext && hasError) {
return
}

var getConsole = function (currentWindow) {
return currentWindow.console || {
log: function () {},
info: function () {},
warn: function () {},
error: function () {},
debug: function () {}
}
}

contextWindow.__karma__ = this


contextWindow.onerror = function () {
return contextWindow.__karma__.error.apply(contextWindow.__karma__, arguments)
}

contextWindow.onbeforeunload = function (e, b) {
if (!reloadingContext) {

contextWindow.__karma__.error('Some of your tests did a full page reload!')
}
}

if (self.config.captureConsole) {

var localConsole = contextWindow.console = getConsole(contextWindow)
var logMethods = ['log', 'info', 'warn', 'error', 'debug']
var patchConsoleMethod = function (method) {
var orig = localConsole[method]
if (!orig) {
return
}
localConsole[method] = function () {
self.log(method, arguments)
return Function.prototype.apply.call(orig, localConsole, arguments)
}
}
for (var i = 0; i < logMethods.length; i++) {
patchConsoleMethod(logMethods[i])
}
}

contextWindow.dump = function () {
self.log('dump', arguments)
}

contextWindow.alert = function (msg) {
self.log('alert', [msg])
}
}

this.log = function (type, args) {
var values = []

for (var i = 0; i < args.length; i++) {
values.push(this.stringify(args[i], 3))
}

this.info({log: values.join(', '), type: type})
}

this.stringify = stringify

var clearContext = function () {
reloadingContext = true

navigateContextTo('about:blank')
}



this.error = function (msg, url, line) {
hasError = true
var message = msg

if (url) {
message = msg + '\nat ' + url + (line ? ':' + line : '')
}

socket.emit('karma_error', message)
this.complete()
return false
}

this.result = function (result) {
if (!startEmitted) {
socket.emit('start', {total: null})
startEmitted = true
}

if (resultsBufferLimit === 1) {
return socket.emit('result', result)
}

resultsBuffer.push(result)

if (resultsBuffer.length === resultsBufferLimit) {
socket.emit('result', resultsBuffer)
resultsBuffer = []
}
}

this.complete = function (result) {
if (resultsBuffer.length) {
socket.emit('result', resultsBuffer)
resultsBuffer = []
}

if (self.config.clearContext) {


setTimeout(function () {
clearContext()
}, 0)
}

socket.emit('complete', result || {}, function () {
if (returnUrl) {
