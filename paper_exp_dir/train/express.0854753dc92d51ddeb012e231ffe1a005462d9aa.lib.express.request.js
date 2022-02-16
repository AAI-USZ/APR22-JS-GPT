




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





exports.normalizePath = function(path) {
return path.replace(/[\s\/]*$/g, '')
}



exports.Request = Class({



params: {},



init: function(request, response) {
process.mixin(true, this, request)
response.headers = {}
this.response = response
this.uri.path = exports.normalizePath(this.uri.path)
this.uri.params = parseNestedParams(this.uri.params)
this.plugins = $(Express.plugins).map(function(plugin){
return new plugin.klass(plugin.options)
})
this.uri.post =
this.header('content-type') == 'application/x-www-form-urlencoded' ?
parseParams(this.body) :
{}
},



header: function(key, val) {
return val === undefined ?
this.headers[key.toLowerCase()] :
this.response.headers[key.toLowerCase()] = val
},



param: function(key) {
return this.params[key] ||
this.uri.post[key] ||
this.uri.params[key]
},



accepts: function(path) {
return this.header('accept').indexOf(mime(path)) != -1
},



status: function(code) {
return this.response.status = code
},



halt: function(code, body) {
this.status(code = code || 404)
if (body = body || statusBodies[code])
return this.respond(body)
throw new InvalidStatusCode(code)
},



respond: function(body) {
this.response.body = body
this.trigger('response')
if (typeof this.response.body != 'string') throw new InvalidResponseBody(this)
if (typeof this.response.status != 'number') throw new InvalidStatusCode(this.response.status)
this.response.sendHeader(this.response.status, this.response.headers)
this.response.sendBody(this.response.body)
this.response.finish()
},
