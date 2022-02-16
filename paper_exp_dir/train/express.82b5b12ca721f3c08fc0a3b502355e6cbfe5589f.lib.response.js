


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


if (req.fresh) this.statusCode = 304;


if (204 == this.statusCode || 304 == this.statusCode) {
this.removeHeader('Content-Type');
this.removeHeader('Content-Length');
body = '';
}


this.end(head ? null : body);
return this;
};



res.json = function(obj){

if (2 == arguments.length) {
this.statusCode = obj;
obj = arguments[1];
}

var app = this.app
, jsonp = app.get('jsonp callback')
, replacer = app.get('json replacer')
, spaces = app.get('json spaces')
, body = JSON.stringify(obj, replacer, spaces)
, callback = this.req.query.callback;

this.charset = this.charset || 'utf-8';
this.set('Content-Type', 'application/json');

if (callback && jsonp) {
this.set('Content-Type', 'text/javascript');
body = callback.replace(/[^[]\w$.]/g, '') + '(' + body + ');';
}

return this.send(body);
};



res.sendfile = function(path, options, fn){
var self = this
, req = self.req
, next = this.req.next
, options = options || {};


if ('function' == typeof options) {
fn = options;
options = {};
}


options.callback = function(err){
if (err) {

if ('ENOENT' == err.code) err = utils.error(404);


if (!self.headerSent) self.removeHeader('Content-Disposition');


if (fn) return fn(err);


if (self.headerSent) return;

return req.next(err);
}

fn && fn();
};


options.path = encodeURIComponent(path);
send(this.req, this, next, options);
};



res.download = function(path, filename, fn){

if ('function' == typeof filename) {
fn = filename;
filename = null;
}

filename = filename || path;
this.set('Content-Disposition', 'attachment; filename="' + basename(filename) + '"');
return this.sendfile(path, fn);
};



res.contentType =
res.type = function(type){
return this.set('Content-Type', ~type.indexOf('/')
? type
: mime.lookup(type));
};



res.format = function(obj){
var keys = Object.keys(obj)
, req = this.req
, next = req.next;

var fn = obj.default;
if (fn) delete obj.default;

var key = req.accepts(keys);

this.set('Vary', 'Accept');

if (key) {
