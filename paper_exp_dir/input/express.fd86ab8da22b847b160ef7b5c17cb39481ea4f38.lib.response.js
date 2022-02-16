

var deprecate = require('depd')('express');
var escapeHtml = require('escape-html');
var http = require('http');
var path = require('path');
var mixin = require('utils-merge');
var sign = require('cookie-signature').sign;
var normalizeType = require('./utils').normalizeType;
var normalizeTypes = require('./utils').normalizeTypes;
var setCharset = require('./utils').setCharset;
var contentDisposition = require('./utils').contentDisposition;
var statusCodes = http.STATUS_CODES;
var cookie = require('cookie');
var send = require('send');
var basename = path.basename;
var extname = path.extname;
var mime = send.mime;
var vary = require('vary');



var res = module.exports = {
__proto__: http.ServerResponse.prototype
};



res.status = function(code){
this.statusCode = code;
return this;
};



res.links = function(links){
var link = this.get('Link') || '';
if (link) link += ', ';
return this.set('Link', link + Object.keys(links).map(function(rel){
return '<' + links[rel] + '>; rel="' + rel + '"';
}).join(', '));
};



res.send = function send(body) {
var chunk = body;
var encoding;
var len;
var req = this.req;
var type;


var app = this.app;


if (arguments.length === 2) {

if (typeof arguments[0] !== 'number' && typeof arguments[1] === 'number') {
deprecate('res.send(body, status): Use res.send(status, body) instead');
this.statusCode = arguments[1];
} else {
this.statusCode = arguments[0];
chunk = arguments[1];
}
}


if (typeof chunk === 'number' && arguments.length === 1) {

if (!this.get('Content-Type')) {
this.type('txt');
}

this.statusCode = chunk;
chunk = http.STATUS_CODES[chunk];
}

switch (typeof chunk) {

case 'string':
if (!this.get('Content-Type')) {
this.type('html');
}
break;
case 'boolean':
case 'number':
case 'object':
if (chunk === null) {
chunk = '';
} else if (Buffer.isBuffer(chunk)) {
if (!this.get('Content-Type')) {
this.type('bin');
}
} else {
return this.json(chunk);
}
break;
}


if (typeof chunk === 'string') {
encoding = 'utf8';
type = this.get('Content-Type');


if (typeof type === 'string') {
this.set('Content-Type', setCharset(type, 'utf-8'));
}
}


if (chunk !== undefined) {
if (!Buffer.isBuffer(chunk)) {

chunk = new Buffer(chunk, encoding);
encoding = undefined;
}

len = chunk.length;
this.set('Content-Length', len);
}


var isHead = req.method === 'HEAD';


if (len !== undefined && (isHead || req.method === 'GET')) {
var etag = app.get('etag fn');
if (etag && !this.get('ETag')) {
etag = etag(chunk, encoding);
etag && this.set('ETag', etag);
}
}


if (req.fresh) this.statusCode = 304;


if (204 == this.statusCode || 304 == this.statusCode) {
this.removeHeader('Content-Type');
this.removeHeader('Content-Length');
this.removeHeader('Transfer-Encoding');
chunk = '';
}


if (isHead) {
this.end();
}


this.end(chunk, encoding);

return this;
};



res.json = function json(obj) {
var val = obj;


if (arguments.length === 2) {

if (typeof arguments[1] === 'number') {
this.statusCode = arguments[1];
if (typeof arguments[0] === 'number') {
deprecate('res.json(obj, status): Use res.json(status, obj) instead');
} else {
deprecate('res.json(num, status): Use res.status(status).json(num) instead');
}
} else {
this.statusCode = arguments[0];
val = arguments[1];
}
}


var app = this.app;
var replacer = app.get('json replacer');
var spaces = app.get('json spaces');
var body = JSON.stringify(val, replacer, spaces);


if (!this.get('Content-Type')) {
this.set('Content-Type', 'application/json');
}

return this.send(body);
};



res.jsonp = function jsonp(obj) {
var val = obj;


if (arguments.length === 2) {

if (typeof arguments[1] === 'number') {
this.statusCode = arguments[1];
if (typeof arguments[0] === 'number') {
deprecate('res.jsonp(obj, status): Use res.jsonp(status, obj) instead');
} else {
deprecate('res.jsonp(num, status): Use res.status(status).jsonp(num) instead');
}
} else {
this.statusCode = arguments[0];
val = arguments[1];
}
}


var app = this.app;
var replacer = app.get('json replacer');
var spaces = app.get('json spaces');
var body = JSON.stringify(val, replacer, spaces);
var callback = this.req.query[app.get('jsonp callback name')];


if (!this.get('Content-Type')) {
this.set('X-Content-Type-Options', 'nosniff');
this.set('Content-Type', 'application/json');
}


if (Array.isArray(callback)) {
callback = callback[0];
}


if (typeof callback === 'string' && callback.length !== 0) {
this.charset = 'utf-8';
this.set('X-Content-Type-Options', 'nosniff');
this.set('Content-Type', 'text/javascript');


callback = callback.replace(/[^\[\]\w$.]/g, '');


body = body
.replace(/\u2028/g, '\\u2028')
.replace(/\u2029/g, '\\u2029');



body = '/**/ typeof ' + callback + ' === \'function\' && ' + callback + '(' + body + ');';
}

return this.send(body);
};



res.sendfile = function(path, options, fn){
options = options || {};
var self = this;
var req = self.req;
var next = this.req.next;
var done;



if ('function' == typeof options) {
fn = options;
options = {};
}


req.socket.on('error', error);


function error(err) {
if (done) return;
done = true;


cleanup();


if (fn) return fn(err);


next(err);
}


function stream(stream) {
if (done) return;
cleanup();
if (fn) stream.on('end', fn);
}


function cleanup() {
req.socket.removeListener('error', error);
}


options.maxage = options.maxage || options.maxAge || 0;


var file = send(req, path, options);
file.on('error', error);
file.on('directory', next);
file.on('stream', stream);

if (options.headers) {

file.on('headers', function headers(res) {
var obj = options.headers;
var keys = Object.keys(obj);

for (var i = 0; i < keys.length; i++) {
var k = keys[i];
res.setHeader(k, obj[k]);
}
});
}


file.pipe(this);
this.on('finish', cleanup);
};



res.download = function(path, filename, fn){

if ('function' == typeof filename) {
fn = filename;
filename = null;
}

filename = filename || path;


var headers = {
'Content-Disposition': contentDisposition(filename)
};

return this.sendfile(path, { headers: headers }, fn);
};



res.contentType =
res.type = function(type){
return this.set('Content-Type', ~type.indexOf('/')
? type
: mime.lookup(type));
};



res.format = function(obj){
var req = this.req;
var next = req.next;

var fn = obj.default;
if (fn) delete obj.default;
var keys = Object.keys(obj);

var key = req.accepts(keys);

this.vary("Accept");

if (key) {
this.set('Content-Type', normalizeType(key).value);
obj[key](req, this, next);
} else if (fn) {
fn();
} else {
var err = new Error('Not Acceptable');
err.status = 406;
err.types = normalizeTypes(keys).map(function(o){ return o.value });
next(err);
}

return this;
};



res.attachment = function(filename){
if (filename) this.type(extname(filename));
this.set('Content-Disposition', contentDisposition(filename));
return this;
};



res.set =
res.header = function header(field, val) {
if (arguments.length === 2) {
if (Array.isArray(val)) val = val.map(String);
else val = String(val);
if ('content-type' == field.toLowerCase() && !/;\s*charset\s*=/.test(val)) {
var charset = mime.charsets.lookup(val.split(';')[0]);
if (charset) val += '; charset=' + charset.toLowerCase();
}
this.setHeader(field, val);
} else {
for (var key in field) {
this.set(key, field[key]);
}
}
return this;
};



res.get = function(field){
return this.getHeader(field);
};



res.clearCookie = function(name, options){
var opts = { expires: new Date(1), path: '/' };
return this.cookie(name, '', options
? mixin(opts, options)
: opts);
};



res.cookie = function(name, val, options){
options = mixin({}, options);
var secret = this.req.secret;
var signed = options.signed;
if (signed && !secret) throw new Error('cookieParser("secret") required for signed cookies');
if ('number' == typeof val) val = val.toString();
if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
if (signed) val = 's:' + sign(val, secret);
if ('maxAge' in options) {
options.expires = new Date(Date.now() + options.maxAge);
options.maxAge /= 1000;
}
if (null == options.path) options.path = '/';
var headerVal = cookie.serialize(name, String(val), options);


var prev = this.get('Set-Cookie');
if (prev) {
if (Array.isArray(prev)) {
headerVal = prev.concat(headerVal);
} else {
headerVal = [prev, headerVal];
}
}
this.set('Set-Cookie', headerVal);
return this;
};




res.location = function(url){
var req = this.req;


if ('back' == url) url = req.get('Referrer') || '/';


this.set('Location', url);
return this;
};



res.redirect = function redirect(url) {
var address = url;
var body;
var status = 302;


if (arguments.length === 2) {
if (typeof arguments[0] === 'number') {
status = arguments[0];
address = arguments[1];
} else {
deprecate('res.redirect(ur, status): Use res.redirect(status, url) instead');
status = arguments[1];
}
}


this.location(address);
address = this.get('Location');


this.format({
text: function(){
body = statusCodes[status] + '. Redirecting to ' + encodeURI(url);
},

html: function(){
var u = escapeHtml(url);
body = '<p>' + statusCodes[status] + '. Redirecting to <a href="' + u + '">' + u + '</a></p>';
},

default: function(){
body = '';
}
});


this.statusCode = status;
this.set('Content-Length', Buffer.byteLength(body));

if (this.req.method === 'HEAD') {
this.end();
}

this.end(body);
};



res.vary = function(field){

if (!field || (Array.isArray(field) && !field.length)) {
deprecate('res.vary(): Provide a field name');
return this;
}

vary(this, field);

return this;
};



res.render = function(view, options, fn){
options = options || {};
var self = this;
var req = this.req;
var app = req.app;


if ('function' == typeof options) {
fn = options, options = {};
}


options._locals = self.locals;


fn = fn || function(err, str){
if (err) return req.next(err);
self.send(str);
};


app.render(view, options, fn);
};
