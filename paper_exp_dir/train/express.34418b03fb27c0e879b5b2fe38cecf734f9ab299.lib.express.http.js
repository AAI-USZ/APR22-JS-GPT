




var http = require('http'),
utils = require('express/utils'),
parse = require('url').parse,
queryString = require('querystring')



function request(method, url, data, headers, fn, redirects) {
var buf = '',
redirects = redirects || 3,
url = parse(url),
path = url.pathname || '/',
search = url.search || '',
hash = url.hash || '',
port = url.port || 80,
headers = utils.mixin(headers, { host: url.hostname }),
client = http.createClient(port, url.hostname)
if (headers.redirect)
redirects = headers.redirect,
delete headers.redirect
if (data) {
data = queryString.stringify(data)
headers['content-length'] = data.length
headers['content-type'] = 'application/x-www-form-urlencoded'
}
var req = client.request(method, path + search + hash, headers)
if (data) req.write(data)
req.addListener('response', function(res){
if (req.statusCode < 200 || req.statusCode >= 400)
fn(new Error('request failed with status ' + res.statusCode + ' "' + http.STATUS_CODES[res.statusCode] + '"'))
else if (res.statusCode >= 300 && res.statusCode < 400)
if (--redirects)
request(method, res.headers.location, headers, data, fn, redirects)
else
