




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
, callback = this.req.query.callback
, jsonp = this.app.enabled('jsonp callback');

this.charset = this.charset || 'utf-8';
this.header('Content-Type', 'application/json');

if (callback && jsonp) {
this.header('Content-Type', 'text/javascript');
body = callback.replace(/[^\w$.]/g, '') + '(' + body + ');';
}

return this.send(body, status);
};



res.status = function(code){
this.statusCode = code;
return this;
};



res.sendfile = function(path, options, fn){
var next = this.req.next;
options = options || {};


if ('function' == typeof options) {
fn = options;
options = {};
}

options.path = encodeURIComponent(path);
options.callback = fn;
send(this.req, this, next, options);
};



res.contentType = function(type){
return this.header('Content-Type', mime.lookup(type));
};



res.attachment = function(filename){
if (filename) this.contentType(filename);
this.header('Content-Disposition', filename
? 'attachment; filename="' + basename(filename) + '"'
: 'attachment');
return this;
};



res.download = function(path, filename, fn, fn2){
var self = this;


if ('function' == typeof filename) {
fn2 = fn;
fn = filename;
filename = null;
}


this.attachment(filename || path).sendfile(path, function(err){
var sentHeader = self._header;
if (err) {
if (!sentHeader) self.removeHeader('Content-Disposition');
if (sentHeader) {
fn2 && fn2(err);
} else if (fn) {
fn(err);
} else {
self.req.next(err);
}
} else if (fn) {
fn();
}
});
};



res.header = function(name, val){
if (1 == arguments.length) return this.getHeader(name);
this.setHeader(name, val);
return this;
};



res.clearCookie = function(name, options){
var opts = { expires: new Date(1) };
return this.cookie(name, '', options
