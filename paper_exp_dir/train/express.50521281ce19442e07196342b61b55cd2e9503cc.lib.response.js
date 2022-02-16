




var fs = require('fs')
, http = require('http')
, path = require('path')
, utils = require('connect').utils
, parseRange = require('./utils').parseRange
, res = http.ServerResponse.prototype
, mime = require('mime');



res.send = function(body, headers, status){

if ('number' == typeof headers) {
status = headers,
headers = null;
}


status = status || 200;


if (!arguments.length) body = status = 204;
