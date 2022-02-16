




var fs = require('fs')
, http = require('http')
, path = require('path')
, connect = require('connect')
, utils = connect.utils
, parseRange = require('./utils').parseRange
, res = http.ServerResponse.prototype
, send = connect.static.send
, join = require('path').join
, mime = require('mime');



res.send = function(body, headers, status){

if ('number' == typeof headers) {
status = headers,
headers = null;
}


