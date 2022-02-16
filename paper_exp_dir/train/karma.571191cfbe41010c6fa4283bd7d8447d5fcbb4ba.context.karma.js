
var stringify = require('../common/stringify')


function ContextKarma (callParentKarmaMethod) {

var hasError = false
var self = this
var isLoaded = false



this.log = function (type, args) {
var values = []

for (var i = 0; i < args.length; i++) {
values.push(this.stringify(args[i], 3))
}

this.info({log: values.join(', '), type: type})
