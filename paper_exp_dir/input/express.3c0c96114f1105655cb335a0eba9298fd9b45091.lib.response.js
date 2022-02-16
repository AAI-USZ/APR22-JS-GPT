


var fs = require('fs')
, http = require('http')
, path = require('path')
, connect = require('connect')
, utils = connect.utils
, normalizeType = require('./utils').normalizeType
, normalizeTypes = require('./utils').normalizeTypes
, statusCodes = http.STATUS_CODES
, send = connect.static.send
, cookie = require('cookie')
, crc = require('crc')
, mime = connect.mime
, basename = path.basename
, extname = path.extname
, join = path.join;



var res = module.exports = {
__proto__: http.ServerResponse.prototype
};



res.status = function(code){
this.statusCode = code;
return this;
};



res.links = function(links){
return this.set('Link', Object.keys(links).map(function(rel){
return '<' + links[rel] + '>; rel="' + rel + '"';
}).join(', '));
};



res.send = function(body){
var req = this.req
, head = 'HEAD' == req.method
, len;


if (2 == arguments.length) {
