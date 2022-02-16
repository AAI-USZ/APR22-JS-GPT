




var fs = require('fs')
, http = require('http')
, path = require('path')
, connect = require('connect')
, utils = connect.utils
, parseRange = require('./utils').parseRange
, res = http.ServerResponse.prototype
, send = connect.static.send
, mime = require('mime');



res.send = function(body, headers, status){

if ('number' == typeof headers) {
status = headers,
headers = null;
}


status = status || 200;


if (!arguments.length) body = status = 204;


switch (typeof body) {
case 'number':
if (!this.header('Content-Type')) {
this.contentType('.txt');
}
body = http.STATUS_CODES[status = body];
break;
case 'string':
if (!this.header('Content-Type')) {
this.contentType('.html');
}
break;
case 'object':
if (body instanceof Buffer) {
if (!this.header('Content-Type')) {
this.contentType('.bin');
}
} else {
if (!this.header('Content-Type')) {
this.contentType('.json');
}
body = JSON.stringify(body);
if (this.req.query.callback && this.app.set('jsonp callback')) {
this.header('Content-Type', 'text/javascript');
body = this.req.query.callback.replace(/[^\w$.]/g, '') + '(' + body + ');';
}
}
break;
}


if (!this.header('Content-Length')) {
this.header('Content-Length', body instanceof Buffer
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


if (204 === status) {
this.removeHeader('Content-Type');
this.removeHeader('Content-Length');
}


this.writeHead(status, this.headers);
this.end('HEAD' == this.req.method ? undefined : body);
};



res.sendfile = function(path, options, fn){
options = options || {};


if ('function' == typeof options) {
fn = options;
options = {};
}

options.path = path;
options.callback = fn;
