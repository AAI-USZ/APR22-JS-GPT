




var Request = require('express/request').Request,
normalizePath = require('express/request').normalizePath,
multipart = require('old'),
utils = require('express/utils'),
http = require('http'),
sys = require('sys'),
fs = require('fs')

global.merge(require('express/plugin'))
global.merge(require('express/dsl'))



Route = new Class({



constructor: function(method, path, callback, options){
this.method = method
this.originalPath = path
this.path = this.normalize(path)
this.callback = callback
},



normalize: function(path) {
var self = this
this.keys = []
if (path instanceof RegExp) return path
return new RegExp('^' + RegExp.escape(normalizePath(path), '.')
.replace(/\*/g, '(.+)')
.replace(/(\/|\\\.):(\w+)\?/g, function(_, c, key){
self.keys.push(key)
return '(?:' + c + '([^\/]+))?'
})
.replace(/:(\w+)/g, function(_, key){
self.keys.push(key)
return '([^\/]+)'
}) + '$', 'i')
}
})



Router = new Class({



constructor: function(request) {
this.request = request
this.method = request.method.lowercase
},



route: function() {
var body,
route = this.matchingRoute()
if (route) {
body = route.callback.apply(this.request, this.request.captures.slice(1));
if (this.request.passed) {
if (typeof this.request.passed === 'string')
