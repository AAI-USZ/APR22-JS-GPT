


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



run: function(args) {
return this.fn.apply(GLOBAL, args)
},



normalize: function(path) {
var self = this
this.keys = []
if (path instanceof RegExp) return path
return new RegExp('^' + normalizePath(path)
.replace(/\/:(\w+)\?/g, function(_, key){
self.keys.push(key)
return '(?:\/([^\/]+))?'
})
.replace(/:(\w+)/g, function(_, key){
self.keys.push(key)
return '([^\/]+)'
}) + '$', 'i')
}
})



Router = Class({



route: function(request){
this.request = request
var route = this.matchingRoute()
if (route)
return route.run(this.request.captures.slice(1))
else if (accepts('html') && set('helpful 404'))
halt(404, require('express/pages/not-found').render())
else
halt()
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
request.addListener('body', function(chunk){ request.body += chunk })
request.addListener('complete', function(){ self.route(request, response) })
})
.listen(this.port, this.host)
puts('Express started at http://' + this.host + ':' + this.port + '/')
},



route: function(request, response){
var body
response.headers = {}, request.params = {}
request.plugins = $(Express.plugins).map(function(plugin){
return new plugin.klass(plugin.options)
})
this.request = request, this.response = response
this.request.uri.path = normalizePath(request.uri.path)
this.request.uri.params = parseNestedParams(request.uri.params)
this.request.uri.post =
header('content-type') == 'application/x-www-form-urlencoded' ?
parseParams(request.body) :
{}
