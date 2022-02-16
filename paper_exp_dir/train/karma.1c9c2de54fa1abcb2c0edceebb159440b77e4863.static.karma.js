(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
VERSION: '%KARMA_VERSION%',
KARMA_URL_ROOT: '%KARMA_URL_ROOT%',
KARMA_PROXY_PATH: '%KARMA_PROXY_PATH%',
BROWSER_SOCKET_TIMEOUT: '%BROWSER_SOCKET_TIMEOUT%',
CONTEXT_URL: 'context.html'
}

},{}],2:[function(require,module,exports){
var stringify = require('../common/stringify')
var constant = require('./constants')
var util = require('../common/util')

function Karma (socket, iframe, opener, navigator, location, document) {
var startEmitted = false
var karmaNavigating = false
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
