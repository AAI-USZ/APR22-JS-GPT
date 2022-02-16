




var http = require('http'),
utils = require('express/utils'),
parse = require('url').parse,
queryString = require('querystring')



function request(method, url, headers, data, fn) {
var buf = '',
