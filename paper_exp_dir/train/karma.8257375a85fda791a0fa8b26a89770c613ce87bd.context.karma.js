
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



