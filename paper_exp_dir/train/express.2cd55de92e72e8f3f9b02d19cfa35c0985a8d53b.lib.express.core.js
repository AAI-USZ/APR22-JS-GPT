


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
