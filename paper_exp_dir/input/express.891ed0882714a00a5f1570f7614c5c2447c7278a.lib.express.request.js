




var StaticFile = require('express/static').File,
statusBodies = require('http').STATUS_CODES,
queryString = require('querystring'),
mime = require('express/mime'),
utils = require('express/utils'),
url = require('url')





exports.normalizePath = function(path) {
return path.replace(/[\s\/]*$/g, '')
}



exports.Request = Class({



init: function(request, response) {
utils.mixin(true, this, request)
response.headers = {}
this.response = response
this.url = url.parse(this.url)
this.url.pathname = exports.normalizePath(this.url.pathname)
this.params = this.params || {}
this.params.path =  {}
this.params.get = this.url.query ? queryString.parseQuery(this.url.query) : {}
this.params.post = this.params.post || {}
this.plugins = Express.plugins.map(function(plugin){
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



accepts: function() {
var accept = this.header('accept')
return accept
? arguments.any(function(path){
var type = mime.type(path)
return accept.indexOf(type) !== -1 ||
accept.indexOf(type.split('/')[0]+'/*') !== -1
})
: true
},



status: function(code) {
this.response.status = code
return this
},



halt: function(code, body, encoding, callback) {
this.status(code = code || 404)
if (body = body || statusBodies[code])
return this.respond(body, encoding, callback)
},



respond: function(body, encoding, callback) {
var self = this
this.response.body = body
if (e)
if (callback !== undefined) callback(e)
else throw e
self.response.writeHeader(self.response.status, self.response.headers)
self.response.write(self.response.body, encoding)
self.response.close()
});
},



contentType: function(path) {
this.header('content-type', mime.type(path))
return this
},



trigger: function(name, data, callback) {
