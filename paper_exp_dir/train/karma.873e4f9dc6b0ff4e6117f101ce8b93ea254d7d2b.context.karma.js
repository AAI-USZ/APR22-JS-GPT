
var stringify = require('../common/stringify')


function ContextKarma (callParentKarmaMethod) {

var hasError = false
var self = this



this.log = function (type, args) {
var values = []

for (var i = 0; i < args.length; i++) {
values.push(this.stringify(args[i], 3))
}

this.info({log: values.join(', '), type: type})
}

this.stringify = stringify



this.error = function () {
hasError = true
callParentKarmaMethod('error', [].slice.call(arguments))
return false
}


function UNIMPLEMENTED_START () {
this.error('You need to include some adapter that implements __karma__.start method!')
}

this.loaded = function () {

if (!hasError) {
try {
this.start(this.config)
} catch (error) {
this.error(error.stack || error.toString())
}
}


this.start = UNIMPLEMENTED_START
}


this.start = UNIMPLEMENTED_START



var proxyMethods = ['complete', 'info', 'result']
for (var i = 0; i < proxyMethods.length; i++) {
(function bindProxyMethod (methodName) {
self[methodName] = function boundProxyMethod () {
callParentKarmaMethod(methodName, [].slice.call(arguments))
}
}(proxyMethods[i]))
}


this.setupContext = function (contextWindow) {


if (self.config.clearContext && hasError) {
return
}



contextWindow.onerror = function () {
return self.error.apply(self, arguments)
}

contextWindow.onbeforeunload = function (e, b) {
callParentKarmaMethod('onbeforeunload', [])
}

contextWindow.dump = function () {
self.log('dump', arguments)
}

var _confirm = contextWindow.confirm
var _prompt = contextWindow.prompt

contextWindow.alert = function (msg) {
self.log('alert', [msg])
}

contextWindow.confirm = function (msg) {
self.log('confirm', [msg])
return _confirm(msg)
}

contextWindow.prompt = function (msg, defaultVal) {
self.log('prompt', [msg, defaultVal])
return _prompt(msg, defaultVal)
}


function getConsole (currentWindow) {
return currentWindow.console || {
log: function () {},
info: function () {},
warn: function () {},
error: function () {},
debug: function () {}
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
try {
return Function.prototype.apply.call(orig, localConsole, arguments)
} catch (error) {
self.log('warn', ['Console method ' + method + ' threw: ' + error])
}
}
}
for (var i = 0; i < logMethods.length; i++) {
patchConsoleMethod(logMethods[i])
}
}
}
