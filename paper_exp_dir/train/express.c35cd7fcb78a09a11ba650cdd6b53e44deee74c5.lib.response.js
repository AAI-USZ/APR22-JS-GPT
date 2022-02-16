




var fs = require('fs')
, http = require('http')
, path = require('path')
, connect = require('connect')
, utils = connect.utils
, statusCodes = http.STATUS_CODES
, parseRange = require('./utils').parseRange
, res = http.ServerResponse.prototype
, send = connect.static.send
, mime = require('mime')
, basename = path.basename
, join = path.join;



res.send = function(body){

if (2 == arguments.length) {
this.statusCode = body;
body = arguments[1];
}

switch (typeof body) {

case 'number':
this.header('Content-Type') || this.contentType('.txt');
