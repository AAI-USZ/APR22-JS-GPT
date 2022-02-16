


process.mixin(require('sys'))
process.mixin(require('express/exceptions'))
process.mixin(require('express/collection'))
process.mixin(require('express/event'))
process.mixin(require('express/request'))
process.mixin(require('express/helpers'))
process.mixin(require('express/plugin'))
process.mixin(require('express/mime'))
process.mixin(require('express/dsl'))

var multipart = require('multipart'),
File = require('file').File



Route = Class({



init: function(method, path, fn, options){
this.method = method
this.originalPath = path
this.path = this.normalize(path)
this.fn = fn
},



run: function(args, context) {
return this.fn.apply(context || GLOBAL, args)
},



normalize: function(path) {
var self = this
this.keys = []
if (path instanceof RegExp) return path
return new RegExp('^' + escapeRegexp(normalizePath(path), '.')
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



Router = Class({



init: function(request) {
this.request = request
},



route: function(){
var route = this.matchingRoute()
if (route)
return route.run(this.request.captures.slice(1), this.request)
else if (this.request.accepts('html') && set('helpful 404'))
this.request.halt(404, require('express/pages/not-found').render(this.request))
else
this.request.halt()
},



matchingRoute: function(){
var self = this
return $(Express.routes).find(function(route){
return self.match(route)
})
},



match: function(route) {
if (this.request.method.toLowerCase() == route.method)
if (this.request.captures = this.request.url.pathname.match(route.path)) {
this.mapParams(route)
return true
}
},



mapParams: function(route) {
var self = this
$(route.keys).each(function(key, i){
self.request.params.path[key] = self.request.captures[++i]
})
}
})



Server = Class({



port: 3000,



host: 'localhost',



backlog: 128,



run: function(port, host, backlog){
var self = this
if (host !== undefined) this.host = host
if (port !== undefined) this.port = port
if (backlog !== undefined) this.backlog = backlog
require('http')
.createServer(function(request, response){
request.body = ''
request.setBodyEncoding('binary')
if (request.headers['content-type'] &&
request.headers['content-type'].indexOf('multipart/form-data') !== -1) {
var stream = new multipart.Stream(request)
stream.addListener('part', function(part){
request.params = { post: {}}
if (part.filename) {
var file = new File(part.tempfile = '/tmp/express-' + Number(new Date), 'w')
part.pos = 0
part.addListener('body', function(chunk){
file.write(chunk, part.pos, 'binary')
part.pos += chunk.length
})
part.addListener('complete', function(){
file.close()
