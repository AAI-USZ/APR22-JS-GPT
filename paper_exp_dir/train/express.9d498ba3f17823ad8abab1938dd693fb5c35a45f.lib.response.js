




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


if (204 == status) {
this.removeHeader('Content-Type');
this.removeHeader('Content-Length');
}


this.statusCode = status;
this.end('HEAD' == this.req.method ? undefined : body);
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
if (val === undefined) {
return this.getHeader(name);
} else {
this.setHeader(name, val);
return val;
}
};



res.clearCookie = function(name, options){
var opts = { expires: new Date(1) };
this.cookie(name, '', options
? utils.merge(options, opts)
: opts);
};



res.cookie = function(name, val, options){
options = options || {};
if ('maxAge' in options) options.expires = new Date(Date.now() + options.maxAge);
var cookie = utils.serializeCookie(name, val, options);
this.header('Set-Cookie', cookie);
};



res.redirect = function(url, status){
var app = this.app
, req = this.req
, base = app.set('home') || '/'
, status = status || 302
, body;


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

if (app.route) {
url = join(app.route, url);
}


var host = req.headers.host
, tls = req.connection.encrypted;
url = 'http' + (tls ? 's' : '') + '://' + host + url;
}



if (req.accepts('html')) {
body = '<p>' + http.STATUS_CODES[status] + '. Redirecting to <a href="' + url + '">' + url + '</a></p>';
this.header('Content-Type', 'text/html');
} else {
body = http.STATUS_CODES[status] + '. Redirecting to ' + url;
this.header('Content-Type', 'text/plain');
}


this.statusCode = status;
this.header('Location', url);
this.end(body);
};



res.local = function(name, val){
this._locals = this._locals || {};
return undefined === val
? this._locals[name]
: this._locals[name] = val;
};



res.locals =
res.helpers = function(obj){
if (obj) {
for (var key in obj) {
this.local(key, obj[key]);
}
} else {
return this._locals;
}
};
