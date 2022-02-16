


(function(){
Express = {
version : '0.0.1',
utilities : {},
modules  : [],
routes  : [],



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
for (i = 0, len = this.modules.length; i < len; ++i)
for (var key in this.modules[i][name])
if (this.modules[i][name].hasOwnProperty(key))
results.push(this.modules[i][name][key].apply(this.modules[i], this.argsArray(arguments, 1)))
return results
},



hookImmutable : function(name, immutable, args) {
for (i = 0, len = this.modules.length; i < len; ++i)
for (var key in this.modules[i][name])
if (this.modules[i][name].hasOwnProperty(key))
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
if (module.settings.hasOwnProperty(name))
Express.settings[module.name][name] = module.settings[name]
}

if ('utilities' in module)
for (var name in module.utilities)
if (module.utilities.hasOwnProperty(name))
Express.utilities[name] = module.utilities[name]

Express.modules.push(module)
},



start : function(port, host) {
this.server.listen(port || 3000, host, this.server.callback)
},

server : {



listen : function(port, host, callback) {
node.http.createServer(callback).listen(port, host)
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
request.headers = Express.arrayToHash(request.headers)
request.uri.params = Express.parseNestedParams(request.uri.params)
request.uri.path = Express.normalizePath(request.uri.path)
Express.hook('onRequest')
try { Express.response.body = Express.callRouteFor(request) }
catch (e) { Express.fail(e) }
Express.hook('onResponse')
response.sendHeader(Express.response.status, Express.hashToArray(Express.response.headers))
response.sendBody(Express.response.body || '')
response.finish()
})
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
