


process.mixin(require('sys'))
process.mixin(require('express/exceptions'))
process.mixin(require('express/collection'))
process.mixin(require('express/event'))
process.mixin(require('express/request'))
process.mixin(require('express/plugin'))
process.mixin(require('express/dsl'))



var multipart = require('multipart'),
events = require('events'),
utils = require('express/utils'),
fs = require('fs')



Route = Class({



init: function(method, path, fn, options){
this.method = method
this.originalPath = path
this.path = this.normalize(path)
this.fn = fn
},



normalize: function(path) {
var self = this
this.keys = []
if (path instanceof RegExp) return path
return new RegExp('^' + utils.escapeRegexp(normalizePath(path), '.')
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
return route.fn.apply(this.request, this.request.captures.slice(1))
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
this.running = true
if (host !== undefined) this.host = host
if (port !== undefined) this.port = port
if (backlog !== undefined) this.backlog = backlog
require('http')
.createServer(function(request, response){
request.body = ''
request.setBodyEncoding('binary')
if (request.headers['content-type'] &&
request.headers['content-type'].indexOf('multipart/form-data') !== -1) {
var stream = new multipart.Stream(request),
promise = new events.Promise,
pendingFiles = 0
request.params = { post: {}}
promise.timeout(set('upload timeout') || 5000)
stream.addListener('part', function(part){
if (part.filename) {
part.pos = 0
++pendingFiles
part.tempfile = '/tmp/express-' + Number(new Date) + utils.uid()
part.addListener('body', function(chunk){
fs.write(chunk, part.pos, 'binary').addErrback(function(){
promise.emitError.apply(promise, arguments)
})
part.pos += chunk.length
})
.addListener('complete', function(){
fs.close().addCallback(function(){
if (!--pendingFiles)
promise.emitSuccess()
}).addErrback(function(){
promise.emitError.apply(promise, arguments)
})
utils.mergeParam(part.name, part, request.params.post)
})
}
else
part.buf = '',
part
.addListener('body', function(chunk){ part.buf += chunk })
.addListener('complete', function(){
if (part.buf.length)
utils.mergeParam(part.name, part.buf, request.params.post)
})
}).addListener('complete', function(){
if (!pendingFiles) promise.emitSuccess()
promise.addCallback(function(){ self.route(request, response) })
})
}
else
request
.addListener('data', function(chunk){ request.body += chunk })
.addListener('end', function(){ self.route(request, response) })
})
.listen(this.port, this.host, this.backlog)
puts('Express started at http://' + this.host + ':' + this.port + '/ in ' + Express.environment + ' mode')
},



route: function(request, response){
request = new Request(request, response)
request.trigger('request')
if (request.response.finished) return
try {
if (typeof (body = (new Router(request)).route()) == 'string')
request.halt(200, body)
}
catch (e) {
if (e instanceof ExpressError)
throw e
if (request.accepts('html') && set('show exceptions'))
request.halt(500, require('express/pages/show-exceptions').render(request, e))
else
request.halt(500)
if (set('throw exceptions'))
throw e
}
}
})



Express = {
version: '0.4.0',
config: [],
routes: [],
plugins: [],
settings: {},
server: new Server
}



configure(function(){
use(require('express/plugins/view').View)
use(require('express/plugins/cache').Cache)
use(require('express/plugins/redirect').Redirect)
use(require('express/plugins/body-decoder').BodyDecoder)
})

configure('development', function(){
enable('helpful 404')
enable('show exceptions')
})

configure('test', function(){
enable('throw exceptions')
})

configure('production', function(){
enable('cache view contents')
enable('cache static files')
})
