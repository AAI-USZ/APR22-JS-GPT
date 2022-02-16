




var Event = require('express/event').Event,
showExceptions = require('express/pages/show-exceptions'),
notFound = require('express/pages/not-found'),
statusBodies = require('http').STATUS_CODES,
queryString = require('querystring'),
mime = require('express/mime'),
url = require('url'),
ext = require('ext'),
sys = require('sys')





exports.normalizePath = function(path) {
return path.replace(/[\s\/]*$/g, '')
}



exports.Request = new Class({



constructor: function(request, response) {
Object.merge(this, request)
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
this.reversedPlugins = this.plugins.slice(0).reverse()
},



header: function(key, val) {
return val === undefined
? this.headers[key.lowercase]
: this.response.headers[key] = val
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
if (!accept || accept === '*/*') return true
return Object.values(arguments).any(function(path){
var type = mime.type(path)
return accept.indexOf(type) !== -1 ||
accept.indexOf(type.split('/')[0] + '/*') !== -1
})
},



get isXHR() {
return (this.header('X-Requested-With') || '').lowercase === 'xmlhttprequest'
},



status: function(code) {
this.response.status = code
return this
},



respond: function(code, body, encoding, callback) {
var self = this
this.status(code = code || 404)
if (encoding instanceof Function)
callback = encoding,
encoding = null
if (204 === code)
body = null
else if (body !== null)
body = body || statusBodies[code]
if (encoding === 'utf8' ||
encoding === 'utf-8')
this.charset = 'UTF-8'
this.response.body = body
this.trigger('response', function(err) {
if (err) return self.error(err, callback)
