




var StaticFile = require('express/static').File



var statusBodies = require('http').STATUS_CODES



InvalidStatusCode = ExpressError.extend({
name: 'InvalidStatusCode',
init: function(status) {
this.message = status + ' is an invalid HTTP response code'
}
})



InvalidResponseBody = ExpressError.extend({
name: 'InvalidResponseBody',
init: function(request) {
this.message = request.method + ' ' + JSON.encode(request.uri.path) + ' did not respond with a body string'
}
})





exports.normalizePath = function(path) {
return path.replace(/[\s\/]*$/g, '')
}



exports.Request = Class({



init: function(request, response) {
process.mixin(true, this, request)
response.headers = {}
this.response = response
this.uri.path = exports.normalizePath(this.uri.path)
this.params = {
get: parseNestedParams(this.uri.params),
post: {},
path: {}
}
this.plugins = $(Express.plugins).map(function(plugin){
return new plugin.klass(plugin.options)
})
},



header: function(key, val) {
return val === undefined ?
this.headers[key.toLowerCase()] :
this.response.headers[key.toLowerCase()] = val
},



param: function(key) {
return this.params.get[key] ||
this.params.post[key] ||
this.params.path[key]
},



accepts: function(path) {
return this.header('accept') ?
this.header('accept').indexOf(mime(path)) !== -1 :
true
},



status: function(code) {
