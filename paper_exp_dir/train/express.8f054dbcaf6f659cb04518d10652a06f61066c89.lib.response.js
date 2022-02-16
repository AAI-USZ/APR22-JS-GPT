




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
this.charset = this.charset || this.app.set('charset') || 'utf-8';
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
this.charset = this.charset || this.app.set('charset') || 'utf-8';
this.contentType('.json');
}
body = JSON.stringify(body);
if (this.req.query.callback && this.app.set('jsonp callback')) {
this.charset = this.charset || this.app.set('charset') || 'utf-8';
this.header('Content-Type', 'text/javascript');
body = this.req.query.callback.replace(/[^\w$.]/g, '') + '(' + body + ');';
}
