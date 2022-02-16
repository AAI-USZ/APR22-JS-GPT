

process.mixin(GLOBAL, require("sys"));

http = require("http");

Express = {
version : '0.0.1',
utilities : {},
modules  : [],
routes  : [],
STATUS_CODES : {
100 : 'Continue',
101 : 'Switching Protocols',
200 : 'OK',
201 : 'Created',
202 : 'Accepted',
203 : 'Non-Authoritative Information',
204 : 'No Content',
205 : 'Reset Content',
206 : 'Partial Content',
300 : 'Multiple Choices',
301 : 'Moved Permanently',
302 : 'Moved Temporarily',
303 : 'See Other',
304 : 'Not Modified',
305 : 'Use Proxy',
400 : 'Bad Request',
401 : 'Unauthorized',
402 : 'Payment Required',
403 : 'Forbidden',
404 : 'Not Found',
405 : 'Method Not Allowed',
406 : 'Not Acceptable',
407 : 'Proxy Authentication Required',
408 : 'Request Time-out',
409 : 'Conflict',
410 : 'Gone',
411 : 'Length Required',
412 : 'Precondition Failed',
413 : 'Request Entity Too Large',
414 : 'Request-URI Too Large',
415 : 'Unsupported Media Type',
500 : 'Internal Server Error',
501 : 'Not Implemented',
502 : 'Bad Gateway',
503 : 'Service Unavailable',
504 : 'Gateway Time-out',
505 : 'HTTP Version not supported'
},



Halt : function(){
this.toString = function() {
return 'Express.Halt'
}
},



response : {
headers : {},
cookie : {}
},



settings : {
basepath : '/',
defaultRoute : {
callback : function() {
Express.respond('Page or file cannot be found', 'Not Found')
}
}
},



RedirectHelpers : {
init : function() {
Express.home = Express.settings.basepath
},

onRequest : {
'set back to referrer' : function() {
Express.back =
Express.requestHeader('Referer') ||
Express.requestHeader('Referrer')
}
}
},

ContentLength : {
onResponse : {
'set content length' : function() {
Express.header('Content-Length', (Express.response.body || '').length)
}
}
},

DefaultContentType : {
onRequest : {
'set response content type to text/html' : function() {
Express.header('Content-Type', 'text/html')
}
}
},

BodyDecoder : {
onRequest : {
'parse urlencoded bodies' : function() {
switch (Express.requestHeader('Content-Type')) {
case 'application/x-www-form-urlencoded':
Express.request.uri.params = Express.parseParams(decodeURIComponent(Express.request.body))
break

case 'application/json':
Express.request.uri.params = Express.jsonDecode(Express.request.body)
break
}
}
}
},

MethodOverride : {
onRequest : {
'set HTTP method to _method when present' : function() {
if (method = Express.param('_method'))
Express.request.method = method.toUpperCase()
}
}
},

Logger : {
onResponse : {
'output log data' : function(){
puts('"' + Express.request.method + ' ' + Express.request.uri.path +
' HTTP/' + Express.request.httpVersion + '" - ' + Express.response.status)
}
}
},



hook : function(name, args) {
var results = []
for (var i = 0, len = this.modules.length; i < len; ++i)
for (var key in this.modules[i][name])
results.push(this.modules[i][name][key].apply(this.modules[i], this.toArray(arguments, 1)))
return results
},



hookImmutable : function(name, immutable, args) {
for (var i = 0, len = this.modules.length; i < len; ++i)
for (var key in this.modules[i][name])
immutable = this.modules[i][name][key].call(this.modules[i], immutable)
return immutable
},



addModule : function(module, args) {
Express.settings[module.name] = {}

if ('init' in module)
module.init.apply(module, Express.toArray(arguments, 1))

if ('settings' in module) {
if (!module.name) throw 'module name is required when using .settings'
for (var name in module.settings)
Express.settings[module.name][name] = module.settings[name]
}

if ('utilities' in module)
for (var name in module.utilities)
Express.utilities[name] = module.utilities[name]

Express.modules.push(module)
},



start : function(port, host) {
this.server.listen(port || 3000, host, this.server.callback)
},

server : {



listen : function(port, host, callback) {
http.createServer(callback).listen(port, host)
puts('Express started at http://' + (host || '127.0.0.1') + ':' + port + '/')
},



callback : function(request, response){
request.body = request.body || ''
request.setBodyEncoding('utf8')
request.addListener('body', function(chunk) { request.body += chunk })
request.addListener('complete', function(){
Express.home = Express.settings.basepath
Express.response.body = null
Express.response.status = 200
Express.request = request
Express.originalResponse = response
request.headers = Express.arrayToHash(request.headers)
request.uri.params = Express.parseNestedParams(request.uri.params)
request.uri.path = Express.normalizePath(request.uri.path)
Express.hook('onRequest')
try { Express.response.body = Express.callRouteFor(request) }
catch (e) { Express.fail(e) }

if (Express.response.body) {
Express.server.finished()
}
})
},

finished: function(body) {
if (body) Express.response.body = body
Express.hook('onResponse')
Express.originalResponse.sendHeader(Express.response.status, Express.hashToArray(Express.response.headers))
Express.originalResponse.sendBody(Express.response.body || '')
Express.originalResponse.finish()
}

},



fail : function(e) {
this.hook('onFailure', e)
if (e.constructor == Express.Halt) return
this.header('Content-Type', 'text/plain')
this.response.body = e.message ? e.name + ': ' + e.message : e.toString()
this.response.status = 500
},



hashToArray : function(hash) {
var array = []
for (var key in hash)
array.push([key, hash[key]])
return array
},



arrayToHash : function(array) {
var hash = {}
for (var i = 0, len = array.length; i < len; ++i)
hash[array[i][0].toLowerCase()] = array[i][1]
return hash
},



jsonEncode : function(object) {
return JSON.stringify(object)
},



jsonDecode : function(string) {
return JSON.parse(string)
},



redirect : function(uri) {
this.header('Location', uri)
this.respond("Page or file has moved to `" + uri + "'", 'Moved Temporarily')
},



status : function(value) {
if (value == undefined) return
if (typeof value == 'number') return this.response.status = value
for (var code in this.STATUS_CODES)
if (this.STATUS_CODES[code].toLowerCase() == value.toLowerCase())
return this.response.status = parseInt(code)
},



arg : function(n) {
return this.request.uri.path.split('/')[n]
},



respond : function(body, status) {
this.response.body = body
this.status(status)
throw new Express.Halt()
},



header : function(name, value) {
return value ?
this.response.headers[name.toLowerCase()] = value :
this.response.headers[name.toLowerCase()]
},



requestHeader : function(name, defaultValue) {
return this.request.headers[name.toLowerCase()] || defaultValue
},



param : function(key, defaultValue) {
return this.request.uri.params[key] || defaultValue
},



parseParams : function(string) {
var params = {}, pairs = string.split('&'), pair
for (var i = 0, len = pairs.length; i < len; ++i) {
pair = pairs[i].split('=')
params[pair[0]] = pair[1]
}
return this.parseNestedParams(params)
},



parseNestedParams : function(params) {
for (var key in params)
if (parts = key.split('['))
if (parts.length > 1)
for (var i = 0, prop = params, len = parts.length; i < len; ++i) {
var name = parts[i].replace(']', '')
if (i == len - 1) {
prop[name] = params[key]
prop = params, delete params[key]
}
else {
prop = prop[name] = prop[name] || {}
}
}

return params
},



parseCookie : function(cookie) {
var hash = {}
if (!cookie) return hash
var attrs = cookie.split(/\s*;\s*/)
for (var i = 0; i < attrs.length; ++i)
hash[attrs[i].split('=')[0]] = decodeURIComponent(attrs[i].split('=')[1])
return hash
},



normalizePath : function(path) {
if (typeof path != 'string') return path
return path.replace(/^(\s|\/)*|(\s|\/)*$/g, '')
},



pathToRegexp : function(path) {
Express.regexpKeys = []
if (path.constructor == RegExp) return path
path = path.replace(/:(\w+)/g, function(_, key){
Express.regexpKeys.push(key)
return '(.*?)'
})
return new RegExp('^' + this.escapeRegexp(path, '/ [ ]') + '$', 'i')
},



escapeRegexp : function(string, chars) {
var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
},



contentsOf : function(body) {
if (typeof body != 'function') throw "Express.contentsOf(): `" + body + "' is not a function"
return body.toString().match(/^[^\{]*{((.*\n*)*)}/m)[1]
},



eval : function(string) {
return eval('with (Express){ with (Express.utilities){ ' + string + '}}')
},



escape : function(html) {
return html.
replace(/&/g, '&amp;').
replace(/"/g, '&quot;').
replace(/</g, '&lt;').
replace(/>/g, '&gt;')
},



toArray : function(arr, offset) {
return Array.prototype.slice.call(arr, offset)
},



routeProvides : function(route, request) {
if (!route.options.provides) return true
if (route.options.provides.constructor != Array)
route.options.provides = [route.options.provides]
for (var i = 0, len = route.options.provides.length; i < len; ++i)
if (request.headers.accept && request.headers.accept.match(route.options.provides[i]))
return true
return false
},



callRouteFor : function(request) {
var route = this.findRouteFor(request) || this.settings.defaultRoute
if (route.keys)
for (var i = 0, len = route.keys.length; i < len; ++i)
this.request.uri.params[route.keys[i]] = Express.captures[i+1] || null
var body = this.eval(Express.contentsOf(route.callback))
if (typeof body != 'string') body = null
return body
},



findRouteFor : function(request) {
for (var i = 0, len = this.routes.length; i < len; ++i)
if (this.routeMatches(this.routes[i], request))
return this.routes[i]
},



routeMatches : function(route, request) {
if (request.method.toLowerCase() != route.method) return false
switch (route.path.constructor) {
case String: return route.path == request.uri.path
case RegExp: return !! (Express.captures = request.uri.path.match(route.path))
}
},



routeFunctionFor : function(method) {
return function(path, options, callback) {
if (options.constructor == Function) callback = options, options = {}
path = Express.pathToRegexp(Express.normalizePath(path))
var route = {
keys : Express.regexpKeys,
path : path,
method : method,
options : options,
callback : callback
}
Express.routes.push(route)
Express.hook('onRouteAdded', route)
}
}
}



exports.get = Express.routeFunctionFor('get')
exports.post = Express.routeFunctionFor('post')
exports.del = Express.routeFunctionFor('delete')
exports.put = Express.routeFunctionFor('put')
use = Express.addModule



use(Express.BodyDecoder)
use(Express.MethodOverride)
use(Express.ContentLength)
use(Express.DefaultContentType)
use(Express.RedirectHelpers)
