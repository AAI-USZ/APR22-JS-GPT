
(function(){
Express = {
version : '0.0.1',
routes  : [],
response : {
body : null,
status : 200,
headers : {}
},

defaultRoute : {
callback : function() {
Express.status('Not Found')
return 'Not Found'
}
},



start : function(port) {
this.server.listen(port || 3000, function(request, response){
request.uri.params = Express.parseNestedParams(request.uri.params)
request.uri.path = Express.normalizePath(request.uri.path)
Express.request = request
Express.response.body = Express.callRouteFor(request)
response.sendHeader(Express.response.status, Express.hashToArray(Express.response.headers))
response.sendBody(Express.response.body || '')
response.finish()
})
},

server : {



listen : function(port, callback) {
new node.http.Server(callback).listen(port)
puts('Express listening to http://localhost:' + port)
}
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
hash[array[i][0]] = array[i][1]
return hash
},



status : function(value) {
if (typeof value == 'number') return this.response.status = value
for (var code in node.http.STATUS_CODES)
if (node.http.STATUS_CODES.hasOwnProperty(code))
if (node.http.STATUS_CODES[code].toLowerCase() == value.toLowerCase())
return this.response.status = code
},



header : function(name, value) {
return value ? this.response.headers[name] = value :
this.response.headers[name]
},



param : function(key, defaultValue) {
return this.request.uri.params[key] || defaultValue
},

parseNestedParams : function(params) {
for (var key in params)
if (params.hasOwnProperty(key))
if (parts = key.split('['))
if (parts.length > 1)
for (i = 0, prop = params, len = parts.length; i < len; ++i) {
if (i == len - 1) {
var name = parts[i].replace(']', '')
prop[name] = params[key]
prop = params, delete params[key]
}
else {
var name = parts[i].replace(']', '')
prop = prop[name] = prop[name] || {}
}
}

return params
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
return body.toString().match(/^[^\{]*{((.*\n*)*)}/m)[1]
},



eval : function(string) {
return eval('function(){ with (Express){' + string + '}}')
},



escape : function(html) {
return html.
replace(/&/g, '&amp;').
replace(/"/g, '&quot;').
replace(/</g, '&lt;').
replace(/>/g, '&gt;')
},



argsArray : function(args, offset) {
return Array.prototype.slice.call(args, offset)
},



callRouteFor : function(request) {
var route = this.findRouteFor(request) || this.defaultRoute
if (route.keys)
for (i = 0, len = route.keys.length; i < len; ++i)
this.request.uri.params[route.keys[i]] = Express.captures[i+1] || null
return this.eval(Express.contentsOf(route.callback))()
},



findRouteFor : function(request) {
for (i = 0, len = this.routes.length; i < len; ++i)
if (this.routeMatches(this.routes[i], request))
return this.routes[i]
},



routeMatches : function(route, request) {
if (route.method.toUpperCase() != request.method) return false
switch (route.path.constructor) {
case String: return route.path == request.uri.path
case RegExp: return !! (Express.captures = request.uri.path.match(route.path))
}
},



routeFunctionFor : function(method) {
return function(path, callback) {
path = Express.pathToRegexp(Express.normalizePath(path))
Express.routes.push({
keys : Express.regexpKeys,
path : path,
method : method,
callback : callback
})
}
}
}

get = Express.routeFunctionFor('get')
post = Express.routeFunctionFor('post')
del = Express.routeFunctionFor('delete')
put = Express.routeFunctionFor('put')

})()

get('user/:name/:operation', function(){
return param('operation') + 'ing ' + param('name')
})

get('articles', function(){
return 'list of articles'
