


var http = require('http'),
events = require('events'),
parse = require('url').parse,
queryString = require('querystring')



function request(method, url, headers, data, promise) {
var buf = '',
promise = promise || new events.Promise,
url = parse(url),
path = url.pathname || '/',
