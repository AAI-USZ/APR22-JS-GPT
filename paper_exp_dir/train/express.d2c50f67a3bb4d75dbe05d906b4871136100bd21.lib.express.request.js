




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
this.response.status = code
return this
},



halt: function(code, body, encoding) {
this.status(code = code || 404)
if (body = body || statusBodies[code])
return this.respond(body, encoding)
throw new InvalidStatusCode(code)
},



respond: function(body, encoding) {
this.response.body = body
this.trigger('response')
if (typeof this.response.body != 'string') throw new InvalidResponseBody(this)
if (typeof this.response.status != 'number') throw new InvalidStatusCode(this.response.status)
this.response.sendHeader(this.response.status, this.response.headers)
this.response.sendBody(this.response.body, encoding)
this.response.finish()
},



contentType: function(path) {
this.header('content-type', mime(path))
return this
},



trigger: function(name, data) {
data = process.mixin(data || {}, {
request: this,
response: this.response
})
this.plugins.each(function(plugin){
plugin.trigger(new Event(name, data))
})
return this
},



download: function(path) {
return this.attachment(basename(path)).sendfile(path)
},



attachment: function(path) {
this.header('content-disposition', path ?
'attachment; filename="' + path + '"' :
'attachment')
return this
},



sendfile: function(path) {
(new StaticFile(path)).send(this)
return this
}
})
