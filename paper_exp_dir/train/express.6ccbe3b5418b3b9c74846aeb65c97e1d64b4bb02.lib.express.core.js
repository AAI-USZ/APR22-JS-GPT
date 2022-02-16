
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
request.headers = Express.arrayToHash(request.headers)
request.cookie = Express.parseCookie(request.headers['Cookie'])
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
node.http.createServer(callback).listen(port)
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



parseCookie : function(cookie) {
var hash = {}
if (!cookie) return hash
var attrs = cookie.split(/\s*;\s*/)
for (i = 0; i < attrs.length; ++i)
hash[attrs[i].split('=')[0]] = unescape(attrs[i].split('=')[1])
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

/**
* Convert native arguments object into an
* array with optional _offset_.
*
* @param  {arguments} args
* @param  {int} offset
* @return {array}
* @api public
*/

argsArray : function(args, offset) {
return Array.prototype.slice.call(args, offset)
},

/**
* Check if _route_ matches the proper _request_ method.
*
* @param  {hash} route
* @param  {hash} request
* @return {bool}
* @api private
*/

routeMethod : function(route, request) {
return route.method.toUpperCase() == request.method
},

/**
* Check if _route_ matches provides the proper
* encoding types listed in _request_'s Accept header.
*
* @param  {hash} route
* @param  {hash} request
* @return {bool}
* @api private
*/

routeProvides : function(route, request) {
if (!route.options.provides) return true
if (route.options.provides.constructor != Array)
route.options.provides = [route.options.provides]
for (i = 0, len = route.options.provides.length; i < len; ++i)
if (request.headers['Accept'].match(route.options.provides[i]))
return true
return false
},

/**
* Attept to match and call a route for
* the given _request_, returning the data
* returned by the route callback.
*
* @param  {object} request
* @return {mixed}
* @api private
*/

callRouteFor : function(request) {
var route = this.findRouteFor(request) || this.defaultRoute
if (route.keys)
for (i = 0, len = route.keys.length; i < len; ++i)
this.request.uri.params[route.keys[i]] = Express.captures[i+1] || null
return this.eval(Express.contentsOf(route.callback))()
},

/**
* Attemp to find and return a route matching _request_.
*
* @param  {object} request
* @return {object}
* @api private
*/

findRouteFor : function(request) {
for (i = 0, len = this.routes.length; i < len; ++i)
if (this.routeMatches(this.routes[i], request))
return this.routes[i]
},

/**
* Check if _route_ matches _request_
*
* @param  {object} route
* @param  {object} request
* @return {bool}
* @api private
*/

routeMatches : function(route, request) {
// var conditions = [Express.routeMethod]
// for (i = 0, len = conditions.length; i < len; ++i)
//   if (!conditions[i](route, request))
//     return false
switch (route.path.constructor) {
case String: return route.path == request.uri.path
case RegExp: return !! (Express.captures = request.uri.path.match(route.path))
}
},

/**
* Return a routing function for _method_.
*
* @param  {string} method
* @return {function}
* @api private
*/

routeFunctionFor : function(method) {
return function(path, options, callback) {
if (options.constructor == Function) callback = options, options = {}
path = Express.pathToRegexp(Express.normalizePath(path))
Express.routes.push({
keys : Express.regexpKeys,
path : path,
method : method,
options : options,
callback : callback
})
}
},

readFile : function(path, callback, errorCallback) {
var promise = node.fs.cat(path, "utf8")
var defaultErrorCallback = function() {
throw "failed to read file `" + path + "'"
}
errorCallback = errorCallback || defaultErrorCallback
promise.addCallback(callback)
promise.addErrback(errorCallback)
},

display : function(path) {
// TODO: parse / remove builder
// TODO: JS Jack? like rack.. jackjs.org
var markup = ''
this.readFile(path, function(contents){
markup = contents
})
return markup
}
}

get = Express.routeFunctionFor('get')
post = Express.routeFunctionFor('post')
del = Express.routeFunctionFor('delete')
put = Express.routeFunctionFor('put')

})()

get('user/:name/:operation', function(){
p(request.headers['User-Agent'])
p(request.headers['Accept'])
p(request.headers['Accept-Encoding'])
p(request.headers['Cookie'])
p(request.cookie)
return param('operation') + 'ing ' + param('name')
})

get('articles', function(){
display('spec/data/example.html.js')
return 'list of articles'
})

get(/articles\/(\d+)/, function(){
return 'article id ' + captures[1]
})

get('articles/:name', function(){
return 'article name ' + param('name')
})

Express.start()
