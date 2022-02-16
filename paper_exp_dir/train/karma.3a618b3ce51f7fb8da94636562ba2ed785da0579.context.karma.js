
var stringify = require('../common/stringify')


var ContextKarma = function (callParentKarmaMethod) {

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


var UNIMPLEMENTED_START = function () {
this.error('You need to include some adapter that implements __karma__.start method!')
}

this.loaded = function () {

if (!hasError) {
this.start(this.config)
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
_confirm(msg)
