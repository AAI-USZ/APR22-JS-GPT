


process.mixin(require('sys'))
process.mixin(require('express/exceptions'))
process.mixin(require('express/helpers'))
process.mixin(require('express/dsl'))



Route = Class({
init: function(method, path, fn, options){
this.method = method
this.originalPath = path
this.path = pathToRegexp(normalizePath(path))
this.fn = fn
},
run: function(){
return this.fn()
}
})



Router = Class({
params: {},
captures: [],
route: function(request){
this.request = request
return this.matchingRoute().run()
},

matchingRoute: function(){
for (var i = 0, len = Express.routes.length; i < len; ++i)
if (this.match(Express.routes[i]))
return Express.routes[i]
throw new NotFoundError(this.request)
},



match: function(route) {
if (this.request.method.toLowerCase() == route.method)
if (this.captures = this.request.uri.path.match(route.path)) {
this.mapParams()
return true
}
},

mapParams: function() {
for (var i = 0, len = keys.length; i < len; ++i)
this.params[keys[i]] = this.captures[i+1]
}
})



Server = Class({
port: 3000,
host: 'localhost',
router: new Router,
run: function(host, port){
var self = this
if (host) this.host = host
if (port) this.port = port
require('http')
.createServer(function(request, response){
request.addListener('body', function(chunk){ request.body += chunk })
request.addListener('complete', function(){ self.route(request, response) })
})
.listen(this.port, this.host)
puts('Express started at http://' + this.host + ':' + this.port + '/')
},
route: function(request, response){
this.request = request, this.response = response
this.request.uri.path = normalizePath(this.request.uri.path)
if (typeof (this.response.body = this.router.route(request)) == 'string')
this.respond()
},
respond: function(body){
if (body) this.response.body = body
this.response.sendHeader(this.response.status || 404, this.response.headers || {})
this.response.sendBody(this.response.body || '')
this.response.finish()
}
})



Express = {
version: '0.0.1',
routes: [],
settings: {},
server: new Server
}





function normalizePath(path) {
return path.replace(/[\s\/]*$/g, '')
}



var keys
function pathToRegexp(path) {
if (path instanceof RegExp) return path
keys = []
return new RegExp('^' +
escapeRegexp(path
.replace(/\/:(\w+)\?/g, function(_, key){
keys.push(key)
return '(?:\/(.*?))?'
})
