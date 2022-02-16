var stringify = require('../common/stringify')
var constant = require('./constants')
var util = require('../common/util')

function Karma (socket, iframe, opener, navigator, location) {
var startEmitted = false
var reloadingContext = false
var self = this
var queryParams = util.parseQueryParams(location.search)
var browserId = queryParams.id || util.generateId('manual-')
var displayName = queryParams.displayName
var returnUrl = queryParams['return_url' + ''] || null

var resultsBufferLimit = 50
var resultsBuffer = []

this.VERSION = constant.VERSION
this.config = {}



this.socket = socket




if (window.addEventListener) {
window.addEventListener('message', function handleMessage (evt) {

var origin = evt.origin || evt.originalEvent.origin


if (origin !== window.location.origin) {
return
}


var method = evt.data.__karmaMethod
if (method) {
if (!self[method]) {
self.error('Received `postMessage` for "' + method + '" but the method doesn\'t exist')
return
}
self[method].apply(self, evt.data.__karmaArguments)
}
}, false)
}

var childWindow = null
function navigateContextTo (url) {
if (self.config.useIframe === false) {

if (self.config.runInParent === false) {


if (childWindow !== null && childWindow.closed !== true) {
childWindow.close()
}
childWindow = opener(url)

} else if (url !== 'about:blank') {
var loadScript = function (idx) {
if (idx < window.__karma__.scriptUrls.length) {
var ele = document.createElement('script')
ele.src = window.__karma__.scriptUrls[idx]
ele.onload = function () {
loadScript(idx + 1)
}
document.body.appendChild(ele)
} else {
window.__karma__.loaded()
}
}
loadScript(0)
}

} else {
iframe.src = url
}
}

this.onbeforeunload = function () {
if (!reloadingContext) {

self.error('Some of your tests did a full page reload!')
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

function clearContext () {
reloadingContext = true

navigateContextTo('about:blank')
}

function getLocation (url, lineno, colno) {
var location = ''

if (url !== undefined) {
location += url
}

if (lineno !== undefined) {
location += ':' + lineno
}

if (colno !== undefined) {
location += ':' + colno
}

return location
}



this.error = function (messageOrEvent, source, lineno, colno, error) {
var message = messageOrEvent
var location = getLocation(source, lineno, colno)

if (location !== '') {
message += '\nat ' + location
}

if (error) {
message += '\n\n' + error.stack
}



message = {message: message, str: message.toString()}

socket.emit('karma_error', message)
this.complete()
return false
}

this.result = function (originalResult) {
var convertedResult = {}


for (var propertyName in originalResult) {
if (originalResult.hasOwnProperty(propertyName)) {
var propertyValue = originalResult[propertyName]

if (Object.prototype.toString.call(propertyValue) === '[object Array]') {
convertedResult[propertyName] = Array.prototype.slice.call(propertyValue)
} else {
convertedResult[propertyName] = propertyValue
}
}
}

if (!startEmitted) {
socket.emit('start', {total: null})
startEmitted = true
}

if (resultsBufferLimit === 1) {
return socket.emit('result', convertedResult)
}

resultsBuffer.push(convertedResult)

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
location.href = returnUrl
}
})
}

this.info = function (info) {

if (!startEmitted && util.isDefined(info.total)) {
socket.emit('start', info)
startEmitted = true
} else {
socket.emit('info', info)
}
}

socket.on('execute', function (cfg) {

startEmitted = false
self.config = cfg

reloadingContext = !self.config.clearContext
navigateContextTo(constant.CONTEXT_URL)



if (window.console && window.console.clear) {
window.console.clear()
}
})
socket.on('stop', function () {
this.complete()
}.bind(this))


socket.on('connect', function () {
socket.io.engine.on('upgrade', function () {
resultsBufferLimit = 1
})
var info = {
name: navigator.userAgent,
id: browserId
}
if (displayName) {
info.displayName = displayName
}
socket.emit('register', info)
})
}

module.exports = Karma
