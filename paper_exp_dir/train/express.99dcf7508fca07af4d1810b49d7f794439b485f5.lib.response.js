




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


this.statusCode = status;
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
send(this.req, this, this.req.next, options);
};



res.contentType = function(type){
return this.header('Content-Type', mime.lookup(type));
};



res.attachment = function(filename){
this.header('Content-Disposition', filename
? 'attachment; filename="' + path.basename(filename) + '"'
: 'attachment');
return this;
};



res.download = function(path, filename, fn){
var self = this;


if ('function' == typeof filename) {
fn = filename;
filename = null;
}


this.attachment(filename || path).sendfile(path, function(err){
if (err) self.removeHeader('Content-Disposition');
if (fn) return fn(err);
if (err) {
self.req.next('ENOENT' == err.code
? null
: err);
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



res.clearCookie = function(name){
this.cookie(name, '', { expires: new Date(1) });
};



res.cookie = function(name, val, options){
var cookie = utils.serializeCookie(name, val, options);
this.header('Set-Cookie', cookie);
};



res.redirect = function(url, status){
var app = this.app
, base = app.set('home') || '/'
, status = status || 302
, body;


var map = {
back: this.req.header('Referrer', base)
, home: base
};


map.__proto__ = this.app.redirects;


var mapped = 'function' == typeof map[url]
? map[url](this.req, this)
: map[url];


url = mapped || url;


if (app.route && !~url.indexOf('://')) {
url = join(app.route, url);
}


if (this.req.accepts('html')) {
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
this.locals = this.locals || {};
return undefined === val
? this.locals[name]
