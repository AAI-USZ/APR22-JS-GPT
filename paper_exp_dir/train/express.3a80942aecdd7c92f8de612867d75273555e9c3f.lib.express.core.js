


process.mixin(require('sys'))
process.mixin(require('express/exceptions'))
process.mixin(require('express/collection'))
process.mixin(require('express/event'))
process.mixin(require('express/request'))
process.mixin(require('express/helpers'))
process.mixin(require('express/plugin'))
process.mixin(require('express/mime'))
process.mixin(require('express/view'))
process.mixin(require('express/dsl'))



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
if (this.request.captures = this.request.uri.path.match(route.path)) {
this.mapParams(route)
return true
}
},



mapParams: function(route) {
var self = this
$(route.keys).each(function(key, i){
self.request.params[key] = self.request.captures[++i]
})
}
})



Server = Class({



port: 3000,



host: 'localhost',



run: function(host, port){
var self = this
if (host) this.host = host
if (port) this.port = port
require('http')
.createServer(function(request, response){
request.body = ''
request.setBodyEncoding('utf8')
request.addListener('body', function(chunk){ request.body += chunk })
request.addListener('complete', function(){ self.route(request, response) })
})
.listen(this.port, this.host)
puts('Express started at http://' + this.host + ':' + this.port + '/')
},



route: function(request, response){
request = new Request(request, response)
request.trigger('request')
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
version: '0.0.1',
config: [],
routes: [],
plugins: [],
settings: {},
server: new Server
}



configure(function(){
set('views', function(){ return set('root') + '/views' })
use(require('express/plugins/body-decoder').BodyDecoder)
})

configure('development', function(){
enable('helpful 404')
enable('show exceptions')
