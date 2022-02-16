


process.mixin(require('sys'))
process.mixin(require('express/exceptions'))
process.mixin(require('express/collection'))
process.mixin(require('express/helpers'))
process.mixin(require('express/plugin'))
process.mixin(require('express/mime'))
process.mixin(require('express/view'))
process.mixin(require('express/dsl'))





function normalizePath(path) {
return path.replace(/[\s\/]*$/g, '')
}



Route = Class({



keys: [],



init: function(method, path, fn, options){
this.method = method
this.originalPath = path
this.path = this.normalize(path)
this.fn = fn
},



run: function(){
return this.fn()
},



normalize: function(path) {
var self = this
this.keys = []
if (path instanceof RegExp) return path
return new RegExp('^' +
escapeRegexp(normalizePath(path)
.replace(/\/:(\w+)\?/g, function(_, key){
self.keys.push(key)
return '(?:\/(.*?))?'
})
.replace(/:(\w+)/g, function(_, key){
self.keys.push(key)
return '(.*?)'
}), '/ [ ]') + '$', 'i')
}
})



Router = Class({



params: {},



captures: [],



route: function(request){
this.request = request
var route = this.matchingRoute()
return route ? route.run() : halt()
},



matchingRoute: function(){
var self = this
return $(Express.routes).find(function(route){
return self.match(route)
})
},



match: function(route) {
if (this.request.method.toLowerCase() == route.method)
if (this.captures = this.request.uri.path.match(route.path)) {
this.mapParams(route)
return true
}
},



mapParams: function(route) {
var self = this
$(route.keys).each(function(key, i){
self.params[key] = self.captures[++i]
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
request.addListener('body', function(chunk){ request.body += chunk })
request.addListener('complete', function(){ self.route(request, response) })
})
.listen(this.port, this.host)
puts('Express started at http://' + this.host + ':' + this.port + '/')
},



route: function(request, response){
var body
response.headers = {}
this.request = request, this.response = response
this.request.uri.path = normalizePath(this.request.uri.path)
this.request.uri.params = parseNestedParams(this.request.uri.params)
trigger('request')
if (typeof (body = Express.router.route(request)) == 'string')
halt(200, body)
},



respond: function(body){
this.response.body = body, trigger('response')
if (typeof this.response.body != 'string') throw new InvalidResponseBody(this.request)
if (typeof this.response.status != 'number') throw new InvalidStatusCode(this.response.status)
this.response.sendHeader(this.response.status, this.response.headers)
this.response.sendBody(this.response.body)
this.response.finish()
}
})



Express = {
version: '0.0.1',
config: [],
routes: [],
plugins: [],
settings: {},
server: new Server,
router: new Router
}
