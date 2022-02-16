




var http = require('http'),
utils = require('express/utils'),
parse = require('url').parse,
queryString = require('querystring')



function request(method, url, headers, data, fn, redirects) {
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
