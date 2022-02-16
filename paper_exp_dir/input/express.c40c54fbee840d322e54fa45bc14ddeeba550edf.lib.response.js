




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
var req = this.req
, head = 'HEAD' == req.method;


if (2 == arguments.length) {
this.statusCode = body;
body = arguments[1];
}

switch (typeof body) {

case 'number':
this.header('Content-Type') || this.contentType('.txt');
this.statusCode = body;
body = http.STATUS_CODES[body];
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
this.header('Content-Type') || this.contentType('.bin');
} else {
return this.json(body);
}
break;
}


if (undefined !== body && !this.header('Content-Length')) {
this.header('Content-Length', Buffer.isBuffer(body)
? body.length
: Buffer.byteLength(body));
}


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

var body = JSON.stringify(obj)
, callback = this.req.query.callback
, jsonp = this.app.enabled('jsonp callback');

this.charset = this.charset || 'utf-8';
this.header('Content-Type', 'application/json');

if (callback && jsonp) {
this.header('Content-Type', 'text/javascript');
body = callback.replace(/[^\w$.]/g, '') + '(' + body + ');';
}

return this.send(body);
};



res.status = function(code){
this.statusCode = code;
return this;
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

self.sentHeader = !! self._header;


if (err) {

if (!self.sentHeader) self.removeHeader('Content-Disposition');


if ('ENOENT' == err.code) return req.next();


if (self.sentHeader) return fn && fn(err);


if (fn) return fn(err);

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

return this.attachment(filename || path).sendfile(path, fn);
};



res.contentType =
res.type = function(type){
return this.header('Content-Type', mime.lookup(type));
};



res.attachment = function(filename){
if (filename) this.contentType(filename);
this.header('Content-Disposition', filename
? 'attachment; filename="' + basename(filename) + '"'
: 'attachment');
return this;
};



res.set = function(field, val){
if (2 == arguments.length) {
this.setHeader(field, val);
} else {
for (var key in field) {
this.setHeader(key, field[key]);
}
}
return this;
};



res.get = function(field){
return this.getHeader(field);
};



res.header = function(field, val){
if (1 == arguments.length) return this.getHeader(field);
this.setHeader(field, val);
return this;
};



res.clearCookie = function(name, options){
var opts = { expires: new Date(1) };
return this.cookie(name, '', options
? utils.merge(options, opts)
: opts);
};



res.cookie = function(name, val, options){
options = options || {};
if ('maxAge' in options) options.expires = new Date(Date.now() + options.maxAge);
if (undefined === options.path) options.path = this.app.set('basepath');
var cookie = utils.serializeCookie(name, val, options);
this.header('Set-Cookie', cookie);
return this;
};



res.redirect = function(url){
var app = this.app
, req = this.req
, base = app.set('basepath') || app.route
, head = 'HEAD' == req.method
, status = 302
, body;


if (2 == arguments.length) {
status = url;
url = arguments[1];
}


var map = {
back: req.header('Referrer', base)
, home: base
};


map.__proto__ = app.redirects;


var mapped = 'function' == typeof map[url]
? map[url](req, this)
: map[url];


url = mapped || url;


if (!~url.indexOf('://')) {

if ('/' != base && 0 != url.indexOf(base)) url = base + url;


var host = req.headers.host
, tls = req.connection.encrypted;
url = 'http' + (tls ? 's' : '') + '://' + host + url;
}


if (req.accepts('html')) {
body = '<p>' + statusCodes[status] + '. Redirecting to <a href="' + url + '">' + url + '</a></p>';
this.header('Content-Type', 'text/html');
} else {
body = statusCodes[status] + '. Redirecting to ' + url;
this.header('Content-Type', 'text/plain');
}


this.statusCode = status;
this.header('Location', url);
this.end(head ? null : body);
};
