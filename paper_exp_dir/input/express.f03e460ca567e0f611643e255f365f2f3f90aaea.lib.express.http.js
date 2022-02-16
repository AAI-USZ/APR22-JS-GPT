


var http = require('http'),
events = require('events'),
parse = require('url').parse,
queryString = require('querystring')



function request(method, url, headers, data, promise) {
var buf = '',
promise = promise || new events.Promise,
url = parse(url),
path = url.pathname || '/',
search = url.search || '',
hash = url.hash || '',
port = url.port || 80,
headers = process.mixin(headers, { host: url.hostname }),
client = http.createClient(port, url.hostname)
client.addListener('error', function(e){
promise.emitError(new Error("client failed to " + method + " `" + url.href + "'"))
})
if (data) {
data = queryString.stringify(data)
headers['content-length'] = data.length
headers['content-type'] = 'application/x-www-form-urlencoded'
}
var request = client.request(method, path + search + hash, headers)
if (response.statusCode < 200 || response.statusCode >= 400)
promise.emitError(new Error('request failed with status ' + response.statusCode + ' "' + http.STATUS_CODES[response.statusCode] + '"'))
else if (response.statusCode >= 300 && response.statusCode < 400)
request(method, response.headers.location, headers, data, promise)
else {
response.setBodyEncoding('utf8')
response
.addListener('body', function(chunk){ buf += chunk })
.addListener('complete', function(){ promise.emitSuccess(buf, response) })
}
})
return promise
}



function client(method, allowData) {
return function(url, headers, data) {
if (allowData) data = data || {}
return request(method.toUpperCase(), url, headers, data)
}
}



exports.get  = exports.view    = client('get')
exports.post = exports.create  = client('post', true)
exports.put  = exports.update  = client('put', true)
exports.del  = exports.destroy = client('delete', true)
