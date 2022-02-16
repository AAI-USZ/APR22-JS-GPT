

process.mixin(GLOBAL, require("sys"));

(function(){
var http = require("http");

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
Express.request.uri.params = Express.parseParams(unescape(Express.request.body))
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
onRequest : {
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
results.push(this.modules[i][name][key].apply(this.modules[i], this.argsArray(arguments, 1)))
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
module.init.apply(module, Express.argsArray(arguments, 1))

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
