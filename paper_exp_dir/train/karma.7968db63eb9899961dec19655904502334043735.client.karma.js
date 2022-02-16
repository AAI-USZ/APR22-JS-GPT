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
