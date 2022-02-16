


(function(){
Express = {
version : '0.0.1',
routes  : [],



Break : function(){
this.toString = function() {
return 'Express.Break'
}
},



response : {
headers : {},
cookie : {}
},



defaults : {
cookie : {
maxAge : 3600
},
route : {
callback : function() {
Express.respond('Page or file cannot be found', 'Not Found')
}
}
},

hookCallbacks : {
request : [



function (request, response) {
Express.response.cookie = request.cookie = Express.parseCookie(request.headers['Cookie'])
}
],

response : [



function(request, response) {
Express.header('Content-Length', (Express.response.body || '').length)
}
]
},



hook : function(name, args) {
if (this.hookCallbacks[name])
for (i = 0, len = this.hookCallbacks[name].length; i < len; ++i)
if (typeof this.hookCallbacks[name][i] == 'function')
this.hookCallbacks[name][i].apply(this, this.argsArray(arguments, 1))
},



use : function(name, callback) {
Express.hookCallbacks[name].push(callback)
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
Express.response.body = null
Express.response.status = 200
Express.request = request
request.headers = Express.arrayToHash(request.headers)
Express.hook('request', request, response)
request.uri.params = Express.parseNestedParams(request.uri.params)
request.uri.path = Express.normalizePath(request.uri.path)
try { Express.response.body = Express.callRouteFor(request) }
catch (e) { Express.fail(e) }
Express.prepareCookie()
Express.hook('response', Express.request, Express.response)
response.sendHeader(Express.response.status, Express.hashToArray(Express.response.headers))
response.sendBody(Express.response.body || '')
response.finish()
}
},



fail : function(e) {
if (e.constructor == Express.Break) return
this.header('Content-Type', 'text/plain')
this.response.body = e.message ? e.name + ': ' + e.message : e.toString()
this.response.status = 500
},

prepareCookie : function() {
var cookie = []
for (var key in this.response.cookie)
if (this.response.cookie.hasOwnProperty(key))
cookie.push(key + '=' + this.response.cookie[key])
if (cookie.length)
this.header('Set-Cookie', cookie.join('; '))
},



hashToArray : function(hash) {
var array = []
for (var key in hash)
if (hash.hasOwnProperty(key))
array.push([key, hash[key]])
return array
},



arrayToHash : function(array) {
var hash = {}
for (i = 0, len = array.length; i < len; ++i)
hash[array[i][0].toLowerCase()] = array[i][1]
return hash
},



jsonEncode : function(object) {
return JSON.stringify(object)
},



jsonDecode : function(string) {
return JSON.parse(string)
},



redirect : function(url) {
this.header('Location', url)
this.respond("Page or file has moved to `" + url + "'", 'Moved Temporarily')
},



status : function(value) {
if (value == undefined) return
if (typeof value == 'number') return this.response.status = value
for (var code in node.http.STATUS_CODES)
if (node.http.STATUS_CODES.hasOwnProperty(code))
if (node.http.STATUS_CODES[code].toLowerCase() == value.toLowerCase())
return this.response.status = parseInt(code)
},



respond : function(body, status) {
this.response.body = body
this.status(status)
throw new Express.Break()
},



header : function(name, value) {
name = name.toLowerCase()
return value ? this.response.headers[name] = value :
this.request.headers[name] || this.response.headers[name]
},



param : function(key, defaultValue) {
return this.request.uri.params[key] || defaultValue
},
