var stringify = require('../common/stringify')
var constant = require('./constants')
var util = require('../common/util')

function Karma (updater, socket, iframe, opener, navigator, location, document) {
this.updater = updater
var startEmitted = false
var self = this
var queryParams = util.parseQueryParams(location.search)
var browserId = queryParams.id || util.generateId('manual-')
var displayName = queryParams.displayName
var returnUrl = queryParams['return_url' + ''] || null

var resultsBufferLimit = 50
var resultsBuffer = []







var policy = {
createURL: function (s) {
return s
},
createScriptURL: function (s) {
return s
}
}
var trustedTypes = window.trustedTypes || window.TrustedTypes
if (trustedTypes) {
policy = trustedTypes.createPolicy('karma', policy)
if (!policy.createURL) {





policy.createURL = function (s) { return s }
}
}






var socketReconnect = false

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


childWindow.onbeforeunload = undefined
childWindow.close()
}
childWindow = opener(url)


} else if (url !== 'about:blank') {
var loadScript = function (idx) {
if (idx < window.__karma__.scriptUrls.length) {
var parser = new DOMParser()

var string = window.__karma__.scriptUrls[idx]
.replace(/\\x3C/g, '<')
.replace(/\\x3E/g, '>')
var doc = parser.parseFromString(string, 'text/html')
var ele = doc.head.firstChild || doc.body.firstChild



if (ele.tagName && ele.tagName.toLowerCase() === 'script') {
var tmp = ele
ele = document.createElement('script')
ele.src = policy.createScriptURL(tmp.src)
ele.crossOrigin = tmp.crossOrigin
}
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


iframe.contentWindow.onbeforeunload = undefined
iframe.src = policy.createURL(url)
}
}

this.log = function (type, args) {
var values = []

for (var i = 0; i < args.length; i++) {
values.push(this.stringify(args[i], 3))
}

this.info({ log: values.join(', '), type: type })
}

this.stringify = stringify

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
var message
if (typeof messageOrEvent === 'string') {
message = messageOrEvent

var location = getLocation(source, lineno, colno)
if (location !== '') {
message += '\nat ' + location
}
if (error && error.stack) {
message += '\n\n' + error.stack
}
} else {


message = { message: messageOrEvent, str: messageOrEvent.toString() }
}

socket.emit('karma_error', message)
self.updater.updateTestStatus('karma_error ' + message)
this.complete()
return false
}

this.result = function (originalResult) {
var convertedResult = {}


for (var propertyName in originalResult) {
if (Object.prototype.hasOwnProperty.call(originalResult, propertyName)) {
var propertyValue = originalResult[propertyName]

if (Object.prototype.toString.call(propertyValue) === '[object Array]') {
convertedResult[propertyName] = Array.prototype.slice.call(propertyValue)
} else {
convertedResult[propertyName] = propertyValue
}
}
}

if (!startEmitted) {
socket.emit('start', { total: null })
self.updater.updateTestStatus('start')
startEmitted = true
}

if (resultsBufferLimit === 1) {
self.updater.updateTestStatus('result')
return socket.emit('result', convertedResult)
}

resultsBuffer.push(convertedResult)

if (resultsBuffer.length === resultsBufferLimit) {
socket.emit('result', resultsBuffer)
self.updater.updateTestStatus('result')
resultsBuffer = []
}
}

this.complete = function (result) {
if (resultsBuffer.length) {
socket.emit('result', resultsBuffer)
resultsBuffer = []
}



var config = this.config
setTimeout(function () {
socket.emit('complete', result || {})
if (config.clearContext) {
navigateContextTo('about:blank')
} else {
self.updater.updateTestStatus('complete')
}
if (returnUrl) {
location.href = returnUrl
}
})
