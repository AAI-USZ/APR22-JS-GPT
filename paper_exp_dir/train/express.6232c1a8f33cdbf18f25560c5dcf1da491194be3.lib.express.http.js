




var http = require('http'),
parse = require('url').parse,
queryString = require('querystring')



function request(method, url, data, headers, callback, redirects, first) {
var buf = '',
redirects = typeof redirects !== 'number' ? 3 : redirects,
url = parse(url),
path = url.pathname || '/',
search = url.search || '',
hash = url.hash || '',
port = url.port || 80,
headers = (headers || {}).merge({ Host: url.hostname }),
client = http.createClient(port, url.hostname)
if (typeof data === 'object' && 'redirects' in data)
redirects = data.redirects,
delete data.redirects
if (first && data) {
if (typeof data !== 'string')
data = queryString.stringify(data)
if (method === 'GET')
