




var Event = require('express/event').Event,
showExceptions = require('express/pages/show-exceptions'),
notFound = require('express/pages/not-found'),
statusBodies = require('http').STATUS_CODES,
queryString = require('querystring'),
mime = require('express/mime'),
url = require('url'),
ext = require('ext')





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
this.reversedPlugins = this.plugins.splice(0).reverse()
},



header: function(key, val) {
return val === undefined
? this.headers[key.lowercase]
: this.response.headers[key] = val
},



param: function(key) {
