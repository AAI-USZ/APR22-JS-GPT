


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
'set content type to text/html' : function() {
Express.header('Content-Type', 'text/html')
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



addModule : function(module) {
Express.settings[module.name] = {}

if ('init' in module)
module.init.call(module)

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
Express.home = Express.settings.basepath
Express.response.body = null
Express.response.status = 200
Express.request = request
request.headers = Express.arrayToHash(request.headers)
Express.hook('onEarlyRequest')
request.uri.params = Express.parseNestedParams(request.uri.params)
request.uri.path = Express.normalizePath(request.uri.path)
Express.hook('onRequest')
try { Express.response.body = Express.callRouteFor(request) }
catch (e) { Express.fail(e) }
Express.hook('onResponse')
response.sendHeader(Express.response.status, Express.hashToArray(Express.response.headers))
response.sendBody(Express.response.body || '')
response.finish()
}
},



fail : function(e) {
if (e.constructor == Express.Halt) return
this.header('Content-Type', 'text/plain')
this.response.body = e.message ? e.name + ': ' + e.message : e.toString()
this.response.status = 500
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
throw new Express.Halt()
},



header : function(name, value) {
name = name.toLowerCase()
return value ? this.response.headers[name] = value :
this.request.headers[name] || this.response.headers[name]
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
if (request.headers.accept && request.headers.accept.match(route.options.provides[i]))
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
var route = this.findRouteFor(request) || this.settings.defaultRoute
if (route.keys)
for (i = 0, len = route.keys.length; i < len; ++i)
this.request.uri.params[route.keys[i]] = Express.captures[i+1] || null
var body = this.eval(Express.contentsOf(route.callback))
if (typeof body != 'string')
throw "route `" + route.method.toUpperCase() + ' ' + route.path + "' must return a string"
return body
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
if (request.method.toLowerCase() != route.method) return false
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
errorCallback = errorCallback || function(){
throw "failed to read file `" + path + "'"
}
promise.addCallback(callback)
promise.addErrback(errorCallback)
},

parseView : function(contents, context) {

},

display : function(path) {

}
}





get = Express.routeFunctionFor('get')
post = Express.routeFunctionFor('post')
del = Express.routeFunctionFor('delete')
put = Express.routeFunctionFor('put')
use = Express.addModule



use(Express.RedirectHelpers)
use(Express.ContentLength)
use(Express.DefaultContentType)

})()
