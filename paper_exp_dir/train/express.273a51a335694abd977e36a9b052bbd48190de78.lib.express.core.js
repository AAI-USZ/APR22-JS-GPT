




var multipart = require('multipart'),
utils = require('express/utils'),
events = require('events'),
fs = require('fs')

global.merge(require('sys'))
global.merge(require('express/event'))
global.merge(require('express/request'))
global.merge(require('express/plugin'))
global.merge(require('express/dsl'))



Route = new Class({



constructor: function(method, path, fn, options){
this.method = method
this.originalPath = path
this.path = this.normalize(path)
this.fn = fn
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
},



route: function() {
var body,
route = this.matchingRoute()
if (route) {
body = route.fn.apply(this.request, this.request.captures.slice(1));
if (this.request.passed) {
if (typeof this.request.passed === 'string')
this.request.url.pathname = this.request.passed
this.request.passed = false
return this.route()
}
return body
}
else if (this.request.accepts('html') && set('helpful 404'))
this.request.halt(404, require('express/pages/not-found').render(this.request))
else
this.request.halt()
},



matchingRoute: function() {
this.lastMatchingRoute = this.lastMatchingRoute || 0
var routes = Express.routes, route
while (route = routes[this.lastMatchingRoute++])
if (this.match(route))
break
return route
},



match: function(route) {
if (this.request.method.toLowerCase() == route.method)
if (this.request.captures = this.request.url.pathname.match(route.path)) {
this.mapParams(route)
return true
}
},



mapParams: function(route) {
route.keys.each(function(key, i){
this.request.params.path[key] = this.request.captures[++i]
}, this)
}
})



Server = new Class({



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
function callback(e, result) {
if (e)
self.error(e, request, response)
else if (!pendingFiles)
self.route(request, response)
}
if (request.headers['content-type'] &&
request.headers['content-type'].includes('multipart/form-data')) {
var stream = multipart.parse(request),
pendingFiles = 0
request.params = { post: {}}
stream
.addListener('partBegin', function(part) {
if (part.filename)
++pendingFiles,
part.tempfile = '/tmp/express-' + Number(new Date) + utils.uid(),
part.fileStream = fs.createWriteStream(part.tempfile)
else
part.buf = ''
})
.addListener('body', function(chunk) {
if (stream.part.fileStream)
stream.part.fileStream.write(chunk)
else
stream.part.buf += chunk
})
.addListener('partEnd', function(part) {
if (!part.name) return
if (part.fileStream)
part.fileStream.close(function(){
--pendingFiles
callback()
}),
utils.mergeParam(part.name, { filename: part.filename, tempfile: part.tempfile }, request.params.post)
else
utils.mergeParam(part.name, part.buf, request.params.post)
})
.addListener('error', callback)
.addListener('complete', callback)
}
else
request
.addListener('data', function(chunk){ request.body += chunk })
.addListener('end', callback)
})
.listen(this.port, this.host, this.backlog)
puts('Express started at http://' + this.host + ':' + this.port + '/ in ' + Express.environment + ' mode')
},



route: function(request, response){
var self = this,
request = new Request(request, response)
request.trigger('request', function(e) {
try {
if (e) throw e
if (request.response.finished) return
if (typeof (body = (new Router(request)).route()) === 'string')
request.halt(200, body)
} catch (e) {
self.error(e, request)
}
})
},



error: function (e, request, response) {
if (!(request instanceof Request))
request = new Request(request, response),
request.trigger('request')
if (request.accepts('html') && set('show exceptions'))
request.halt(500, require('express/pages/show-exceptions').render(request, e))
else
request.halt(500)
if (set('throw exceptions'))
throw e
}
})



Express = {
version: '0.7.6',
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
