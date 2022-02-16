


var http = require('http'),
events = require('events'),
parse = require('url').parse

function request(method, url, headers, promise) {
var buf = '',
promise = promise || new events.Promise,
url = parse(url),
path = url.pathname || '/',
port = url.port || 80,
headers = process.mixin(headers, { host: url.hostname }),
client = http.createClient(port, url.hostname)
client.addListener('error', function(e){
promise.emitError(new Error("client failed to " + method + " `" + url.href + "'"))
})
client.request(method, path, headers).finish(function(response){
if (response.statusCode < 200 || response.statusCode >= 400)
promise.emitError(new Error('request failed with status ' + response.statusCode + ' "' + http.STATUS_CODES[response.statusCode] + '"'))
else if (response.statusCode >= 300 && response.statusCode < 400)
request(method, response.headers.location, headers, promise)
else {
response.setBodyEncoding('utf8')
