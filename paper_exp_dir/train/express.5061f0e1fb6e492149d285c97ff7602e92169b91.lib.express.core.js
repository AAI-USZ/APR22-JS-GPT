


process.mixin(require('sys'))



ExpressError = Class({
name: 'ExpressError',
init: function(message) {
this.message = message
},
toString: function() {
return this.name + ': ' + this.message
}
})



Route = Class({
init: function(method, path, fn, options){
this.method = method
this.originalPath = path
this.path = pathToRegexp(normalizePath(path))
this.fn = fn
},
run: function(){
return process
.compile('with(Express.helpers){ (' + this.fn + ')() }',
this.method + '(' + jsonEncode(this.originalPath) + ')')
}
})



NotFoundError = ExpressError.extend({
name: 'NotFoundError',
init: function(request) {
this.message = 'failed to find ' + request.method + ' ' + jsonEncode(request.uri.path)
}
})

var captures = [],
params = {}

Router = Class({
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
if (captures = this.request.uri.path.match(route.path)) {
this.mapParams()
return true
}
},

mapParams: function() {
for (var i = 0, len = keys.length; i < len; ++i)
params[keys[i]] = captures[i+1]
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
helpers: {},
settings: {},
server: new Server
}



function normalizePath(path) {
return path.replace(/[\s\/]*$/g, '')
}

param = function(key) {
return params[key]
}

jsonEncode = function(object) {
return JSON.stringify(object)
}



escape = function(html) {
if (html instanceof String)
return html
.replace(/&/g, '&amp;')
.replace(/"/g, '&quot;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
}



toArray = function(arr, offset) {
return Array.prototype.slice.call(arr, offset)
}



function route(method) {
return function(path, options, fn){
if (options instanceof Function)
fn = options, options = {}
Express.routes.push(new Route(method, path, fn, options))
}
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
.replace(/:(\w+)/g, function(_, key){
keys.push(key)
return '(.*?)'
}), '/ [ ]') + '$', 'i')
}



escapeRegexp = function(string, chars) {
var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
}

set = function(option, val) {
return val == undefined ?
Express.settings[option] :
Express.settings[option] = val
}

enable = function(option) {
set(option, true)
}

disable = function(option) {
set(option, false)
}

run = function() {
Express.server.run()
}



