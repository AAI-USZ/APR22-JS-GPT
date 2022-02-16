




var statusBodies = require('http').STATUS_CODES,
queryString = require('querystring'),
mime = require('express/mime'),
utils = require('express/utils'),
url = require('url')





exports.normalizePath = function(path) {
return path.replace(/[\s\/]*$/g, '')
}



exports.Request = new Class({



constructor: function(request, response) {
utils.mixin(this, request)
response.headers = {}
this.response = response
this.url = url.parse(this.url)
this.url.pathname = exports.normalizePath(this.url.pathname)
this.params = this.params || {}
this.params.path =  {}
