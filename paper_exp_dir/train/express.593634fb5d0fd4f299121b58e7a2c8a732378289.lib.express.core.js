




var multipart = require('multipart'),
utils = require('express/utils'),
events = require('events'),
fs = require('fs')

utils.mixin(require('sys'))
utils.mixin(require('express/exceptions'))
utils.mixin(require('express/collection'))
utils.mixin(require('express/event'))
utils.mixin(require('express/request'))
utils.mixin(require('express/plugin'))
utils.mixin(require('express/dsl'))



Route = Class({



init: function(method, path, fn, options){
this.method = method
this.originalPath = path
this.path = this.normalize(path)
this.fn = fn
},



normalize: function(path) {
var self = this
this.params = []
if (path instanceof RegExp) return path
return new RegExp('^' + utils.escapeRegexp(normalizePath(path), '.')
.replace(/\*/g, '(.+)')
.replace(/(\/|\\\.):(\w+)\?/g, function(_, c, key){
self.params.push(key)
return '(?:' + c + '([^\/]+))?'
})
.replace(/:(\w+)/g, function(_, key){
self.params.push(key)
return '([^\/]+)'
}) + '$', 'i')
}
})



Router = Class({



init: function(request) {
this.request = request
},



route: function(){
var route = this.matchingRoute()
if (route)
return route.fn.apply(this.request, this.request.captures.slice(1))
else if (this.request.accepts('html') && set('helpful 404'))
this.request.halt(404, require('express/pages/not-found').render(this.request))
else
this.request.halt()
},



matchingRoute: function(){
return Express.routes.find(function(route){
return this.match(route)
}, this)
},



match: function(route) {
if (this.request.method.toLowerCase() == route.method)
if (this.request.captures = this.request.url.pathname.match(route.path)) {
this.mapParams(route)
return true
