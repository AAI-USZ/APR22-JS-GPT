

var http = require('http')
, path = require('path')
, connect = require('connect')
, utils = connect.utils
, sign = require('cookie-signature').sign
, normalizeType = require('./utils').normalizeType
, normalizeTypes = require('./utils').normalizeTypes
, etag = require('./utils').etag
, statusCodes = http.STATUS_CODES
, cookie = require('cookie')
, send = require('send')
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
var req = this.req;
var head = 'HEAD' == req.method;
var len;


if (2 == arguments.length) {

if ('number' != typeof body && 'number' == typeof arguments[1]) {
this.statusCode = arguments[1];
} else {
this.statusCode = body;
body = arguments[1];
}
}

switch (typeof body) {
