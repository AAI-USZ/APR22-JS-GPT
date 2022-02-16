




var statusBodies = {
100: 'Continue',
101: 'Switching Protocols',
200: 'OK',
201: 'Created',
202: 'Accepted',
203: 'Non-Authoritative Information',
204: 'No Content',
205: 'Reset Content',
206: 'Partial Content',
300: 'Multiple Choices',
301: 'Moved Permanently',
302: 'Moved Temporarily',
303: 'See Other',
304: 'Not Modified',
305: 'Use Proxy',
400: 'Bad Request',
401: 'Unauthorized',
402: 'Payment Required',
403: 'Forbidden',
404: 'Not Found',
405: 'Method Not Allowed',
406: 'Not Acceptable',
407: 'Proxy Authentication Required',
408: 'Request Time-out',
409: 'Conflict',
410: 'Gone',
411: 'Length Required',
412: 'Precondition Failed',
413: 'Request Entity Too Large',
414: 'Request-URI Too Large',
415: 'Unsupported Media Type',
500: 'Internal Server Error',
501: 'Not Implemented',
502: 'Bad Gateway',
503: 'Service Unavailable',
504: 'Gateway Time-out',
505: 'HTTP Version not supported'
}



InvalidStatusCode = ExpressError.extend({
name: 'InvalidStatusCode',
init: function(status) {
this.message = status + ' is an invalid HTTP response code'
}
})





JSON.encode = JSON.stringify
JSON.decode = JSON.parse



exports.dirname = function(path) {
return path.split('/').slice(0, -1).join('/')
}



exports.extname = function(path) {
if (path.lastIndexOf('.') < 0) return
return path.slice(path.lastIndexOf('.') + 1)
}



exports.param = function(key) {
return Express.server.request.params[key] ||
Express.server.request.uri.post[key] ||
Express.server.request.uri.params[key]
}



exports.accepts = function(path) {
return header('accept').indexOf(mime(path)) != -1
}



exports.header = function(key, val) {
return val === undefined ?
Express.server.request.headers[key.toLowerCase()] :
Express.server.response.headers[key.toLowerCase()] = val
}



var status = exports.status = function(code) {
return Express.server.response.status = code
}



exports.halt = function(code, body) {
status(code = code || 404)
if (body = body || statusBodies[code])
return Express.server.respond(body)
throw new InvalidStatusCode(code)
}



exports.escape = function(html) {
if (html instanceof String)
return html
.replace(/&/g, '&amp;')
.replace(/"/g, '&quot;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
}



exports.toArray = function(arr, offset) {
return Array.prototype.slice.call(arr, offset)
}



exports.escapeRegexp = function(string, chars) {
var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
}



function decode(params) {
for (var key in params)
params[key] = decodeURIComponent(params[key]).replace(/\+/g, ' ')
}



var parseNestedParams = exports.parseNestedParams = function(params) {
var parts, key
decode(params)
for (key in params)
if (parts = key.split('['))
if (parts.length > 1)
for (var i = 0, prop = params, len = parts.length; i < len; ++i) {
var name = parts[i].replace(']', '')
if (i == len - 1)
prop[name] = params[key],
prop = params,
delete params[key]
else
prop = prop[name] = prop[name] || {}
}
return params
}



exports.parseParams = function(string) {
return parseNestedParams($(string.split('&')).reduce({}, function(params, pair){
pair = pair.split('=')
params[pair[0]] = pair[1]
return params
}))
}



exports.contentType = function(path) {
header('content-type', mime(path))
}
