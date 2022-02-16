




var fs = require('fs')
, http = require('http')
, path = require('path')
, connect = require('connect')
, utils = connect.utils
, parseRange = require('./utils').parseRange
, res = http.ServerResponse.prototype
, send = connect.static.send
, mime = require('mime')
, basename = path.basename
, join = path.join;



res.send = function(body, headers, status){

if ('number' == typeof headers) {
status = headers,
headers = null;
}


status = status || this.statusCode;


if (!arguments.length || undefined === body) body = status = 204;


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
if (Buffer.isBuffer(body)) {
if (!this.header('Content-Type')) {
this.contentType('.bin');
}
} else {
if (!this.header('Content-Type')) {
this.charset = this.charset || 'utf-8';
this.contentType('.json');
}
body = JSON.stringify(body);
if (this.req.query.callback && this.app.set('jsonp callback')) {
this.charset = this.charset || 'utf-8';
this.header('Content-Type', 'text/javascript');
body = this.req.query.callback.replace(/[^\w$.]/g, '') + '(' + body + ');';
}
}
break;
}


if (!this.header('Content-Length')) {
this.header('Content-Length', Buffer.isBuffer(body)
? body.length
: Buffer.byteLength(body));
}


if (headers) {
var fields = Object.keys(headers);
for (var i = 0, len = fields.length; i < len; ++i) {
var field = fields[i];
this.header(field, headers[field]);
}
}


if (204 == status || 304 == status) {
this.removeHeader('Content-Type');
this.removeHeader('Content-Length');
}


this.statusCode = status;
this.end('HEAD' == this.req.method ? undefined : body);
return this;
};



res.json = function(obj, headers, status){
this.charset = this.charset || 'utf-8';
this.header('Content-Type', 'application/json');
return this.send(JSON.stringify(obj), headers, status);
};



res.status = function(code){
this.statusCode = code;
return this;
};



res.sendfile = function(path, options, fn){
var next = this.req.next;
