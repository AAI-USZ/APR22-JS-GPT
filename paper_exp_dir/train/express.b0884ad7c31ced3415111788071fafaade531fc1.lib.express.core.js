




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
},



route: function() {
var body,
route = this.matchingRoute()
if (route) {
body = route.callback.apply(this.request, this.request.captures.slice(1));
if (this.request.passed) {
if (typeof this.request.passed === 'string')
this.request.url.pathname = this.request.passed
this.request.passed = false
return this.route()
}
return body
}
else
this.request.notFound()
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
var val = this.request.captures[++i]
if (key in Express.params)
if ((val = Express.params[key].call(this.request, val)) === false)
this.request.passed = true
this.request.params.path[key] = this.request.captures[i] = val
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
this.http = require('http')
.createServer(function(req, response){
var request, pendingFiles = 0
req.setBodyEncoding('binary')
request = new Request(req, response)
request.body = ''
function callback(err) {
if (err)
request.error(err)
else if (!pendingFiles)
self.route(request)
}
if (request.header('content-type') &&
request.header('content-type').includes('multipart/form-data')) {
var stream,
contentLength = parseInt(request.header('content-length')),
maxBodyLength = set('max upload size')
if (maxBodyLength && contentLength > maxBodyLength)
return callback(new Error('upload size limit exceeded'))
stream = multipart.parse(req)
stream
.addListener('partBegin', function(part) {
if (part.filename)
++pendingFiles,
part.tempfile = '/tmp/express-' + Number(new Date) + utils.uid(),
part.fileStream = fs.createWriteStream(part.tempfile),
part.fileStream.addListener('error', callback)
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
req
.addListener('data', function(chunk){ request.body += chunk })
.addListener('end', callback)
})
this.http.listen(this.port, this.host, this.backlog)
puts('Express started at http://' + this.host + ':' + this.port + '/ in ' + Express.environment + ' mode')
},



route: function(request){
var self = this
request.trigger('request', function(err) {
try {
if (err) throw err
if (request.response.finished) return
if (typeof (body = (new Router(request)).route()) === 'string')
request.halt(200, body, function(err){
if (err) request.error(err)
})
} catch (err) {
request.error(err)
}
})
}
})



Express = {
version: '0.8.0',
config: [],
routes: [],
plugins: [],
settings: {},
params: {},
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
enable('cache view partials')
enable('cache static files')
})
