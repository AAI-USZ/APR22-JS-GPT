




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
return this.params.get[key] ||
this.params.post[key] ||
this.params.path[key]
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
if (body = body || statusBodies[code])
return this.respond(body, encoding, callback)
},



respond: function(body, encoding, callback) {
var self = this
this.response.body = body
this.trigger('response', function(err) {
if (err)
if (callback !== undefined) callback(err)
else self.error(err)
self.response.writeHeader(self.response.status, self.response.headers)
self.response.write(self.response.body, encoding)
self.response.end()
}, true)
},



pass: function(path) {
this.passed = path || true
return this
},



contentType: function(path) {
this.header('content-type', mime.type(path))
return this
},



trigger: function(name, data, callback, reverse) {
if (data instanceof Function)
reverse = callback,
callback = data,
data = null
data = data || {}
data.merge({ request: this, response: this.response })
var self = this,
complete = 0,
total = this.plugins.length,
plugins = reverse
? self.plugins.reverse()
: self.plugins
;(function next(err) {
if (err || complete === total)
callback(err)
else {
if (plugins.at(complete++).trigger(new Event(name, data), next) !== true)
next()
}
})()
return this
},



download: function(path) {
return this.attachment(basename(path)).sendfile(path)
},



attachment: function(path) {
this.header('content-disposition', path
? 'attachment; filename="' + path + '"'
: 'attachment')
return this
},



error: function(err) {
if (Express.error)
Express.error.call(this, err)
else if (this.accepts('html') && set('show exceptions'))
this.halt(500, showExceptions.render(this, err))
else
this.halt(500)
if (set('throw exceptions'))
throw err
return this
},



notFound: function() {
if (Express.notFound)
Express.notFound.call(this)
else if (this.accepts('html') && set('helpful 404'))
this.halt(404, notFound.render(this))
else
this.halt()
return this
}
})
