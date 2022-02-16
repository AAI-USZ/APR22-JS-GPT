




var Event = require('express/event').Event,
showExceptions = require('express/pages/show-exceptions'),
notFound = require('express/pages/not-found'),
statusBodies = require('http').STATUS_CODES,
queryString = require('querystring'),
mime = require('express/mime'),
url = require('url')





exports.normalizePath = function(path) {
return path.replace(/[\s\/]*$/g, '')
}



exports.Request = new Class({



constructor: function(request, response) {
this.merge(request)
response.headers = {}
this.response = response
this.url = url.parse(this.url)
this.url.pathname = exports.normalizePath(this.url.pathname)
this.params = {}
this.params.path = {}
this.params.get = this.url.query ? queryString.parseQuery(this.url.query) : {}
this.params.post = this.params.post || {}
this.plugins = Express.plugins.map(function(plugin){
return new plugin.klass(plugin.options)
})
},



header: function(key, val) {
return val === undefined
? this.headers[key.lowercase]
: this.response.headers[key.lowercase] = val
},



param: function(key) {
if (key in this.params.get)
return this.params.get[key]
if (key in this.params.post)
return this.params.post[key]
if (key in this.params.path)
return this.params.path[key]
},



accepts: function() {
var accept = this.header('accept')
if (!accept) return true
return arguments.any(function(path){
var type = mime.type(path)
return accept.indexOf(type) !== -1 ||
accept.indexOf(type.split('/')[0] + '/*') !== -1
})
},



get isXHR() {
return (this.header('x-requested-with') || '').lowercase === 'xmlhttprequest'
},



status: function(code) {
this.response.status = code
return this
},



halt: function(code, body, encoding, callback) {
if (encoding instanceof Function)
callback = encoding,
encoding = null
this.status(code = code || 404)
if (body !== null)
body = body || statusBodies[code]
return this.respond(body, encoding, callback)
},



respond: function(body, encoding, callback) {
var self = this
this.response.body = body
this.trigger('response', function(err) {
if (err) self.error(err, callback)



if (!body) self.response.useChunkedEncodingByDefault = false
self.sendHead()
if (body) self.response.write(self.response.body, encoding)
self.response.end()
}, true)
},

