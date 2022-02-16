


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



res.send = function(body){
var req = this.req
, head = 'HEAD' == req.method
, len;


if (2 == arguments.length) {
this.statusCode = body;
body = arguments[1];
}


if (body instanceof String) body = body.toString();

switch (typeof body) {

case 'number':
this.get('Content-Type') || this.type('txt');
this.statusCode = body;
body = http.STATUS_CODES[body];
break;

case 'string':
if (!this.get('Content-Type')) {
this.charset = this.charset || 'utf-8';
this.type('html');
}
break;
case 'boolean':
case 'object':
if (null == body) {
body = '';
} else if (Buffer.isBuffer(body)) {
this.get('Content-Type') || this.type('bin');
} else {
return this.json(body);
}
break;
}


if (undefined !== body && !this.get('Content-Length')) {
this.set('Content-Length', len = Buffer.isBuffer(body)
? body.length
: Buffer.byteLength(body));
}



if (len > 1024) {
if (!this.get('ETag')) this.set('ETag', Buffer.isBuffer(body)
? crc.buffer.crc32(body)
: crc.crc32(body));
}


