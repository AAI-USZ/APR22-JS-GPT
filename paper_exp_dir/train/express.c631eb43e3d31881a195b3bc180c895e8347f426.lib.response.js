




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



res.send = function(body, status){

status = status || this.statusCode;


switch (typeof body) {
case 'number':
if (!this.header('Content-Type')) {
this.contentType('.txt');
}
body = http.STATUS_CODES[status = body];
break;
case 'string':
if (!this.header('Content-Type')) {
this.charset = this.charset || 'utf-8';
this.contentType('.html');
}
break;
case 'boolean':
case 'object':
if (null == body) {
body = '';
} else if (Buffer.isBuffer(body)) {
if (!this.header('Content-Type')) this.contentType('.bin');
} else {
return this.json(body, status);
}
break;
}


if (undefined !== body && !this.header('Content-Length')) {
this.header('Content-Length', Buffer.isBuffer(body)
? body.length
: Buffer.byteLength(body));
}


if (204 == status || 304 == status) {
this.removeHeader('Content-Type');
this.removeHeader('Content-Length');
body = '';
}


this.statusCode = status;
this.end('HEAD' == this.req.method ? undefined : body);
return this;
};



res.json = function(obj, status){
var body = JSON.stringify(obj)
