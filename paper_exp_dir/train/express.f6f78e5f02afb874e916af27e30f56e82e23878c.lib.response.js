

var contentDisposition = require('content-disposition');
var deprecate = require('depd')('express');
var escapeHtml = require('escape-html');
var http = require('http');
var isAbsolute = require('./utils').isAbsolute;
var onFinished = require('on-finished');
var path = require('path');
var merge = require('utils-merge');
var sign = require('cookie-signature').sign;
var normalizeType = require('./utils').normalizeType;
var normalizeTypes = require('./utils').normalizeTypes;
var setCharset = require('./utils').setCharset;
var statusCodes = http.STATUS_CODES;
var cookie = require('cookie');
var send = require('send');
var extname = path.extname;
var mime = send.mime;
var resolve = path.resolve;
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
deprecate('res.send(body, status): Use res.status(status).send(body) instead');
this.statusCode = arguments[1];
} else {
deprecate('res.send(status, body): Use res.status(status).send(body) instead');
this.statusCode = arguments[0];
chunk = arguments[1];
}
}


if (typeof chunk === 'number' && arguments.length === 1) {

if (!this.get('Content-Type')) {
this.type('txt');
}

deprecate('res.send(status): Use res.sendStatus(status) instead');
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
} else {

this.end(chunk, encoding);
}

return this;
};



res.json = function json(obj) {
var val = obj;


if (arguments.length === 2) {

if (typeof arguments[1] === 'number') {
deprecate('res.json(obj, status): Use res.status(status).json(obj) instead');
this.statusCode = arguments[1];
} else {
deprecate('res.json(status, obj): Use res.status(status).json(obj) instead');
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
deprecate('res.jsonp(obj, status): Use res.status(status).json(obj) instead');
this.statusCode = arguments[1];
} else {
deprecate('res.jsonp(status, obj): Use res.status(status).jsonp(obj) instead');
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



res.sendStatus = function sendStatus(statusCode) {
var body = http.STATUS_CODES[statusCode] || String(statusCode);

this.statusCode = statusCode;
this.type('txt');

return this.send(body);
};



res.sendFile = function sendFile(path, options, fn) {
var req = this.req;
var res = this;
var next = req.next;

if (!path) {
throw new TypeError('path argument is required to res.sendFile');
}


if (typeof options === 'function') {
fn = options;
options = {};
}

options = options || {};

if (!options.root && !isAbsolute(path)) {
throw new TypeError('path must be absolute or specify root to res.sendFile');
}


var pathname = encodeURI(path);
var file = send(req, pathname, options);


sendfile(res, file, options, function (err) {
if (fn) return fn(err);
if (err && err.code === 'EISDIR') return next();


if (err && err.code !== 'ECONNABORT' && err.syscall !== 'write') {
next(err);
}
});
};



res.sendfile = function(path, options, fn){
var req = this.req;
var res = this;
var next = req.next;


if (typeof options === 'function') {
fn = options;
options = {};
}

options = options || {};


var file = send(req, path, options);


sendfile(res, file, options, function (err) {
if (fn) return fn(err);
if (err && err.code === 'EISDIR') return next();


if (err && err.code !== 'ECONNABORT' && err.syscall !== 'write') {
next(err);
}
});
};

res.sendfile = deprecate.function(res.sendfile,
'res.sendfile: Use res.sendFile instead');



res.download = function download(path, filename, fn) {

if (typeof filename === 'function') {
fn = filename;
filename = null;
}

filename = filename || path;


var headers = {
'Content-Disposition': contentDisposition(filename)
};


var fullPath = resolve(path);

return this.sendFile(fullPath, { headers: headers }, fn);
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



res.attachment = function attachment(filename) {
if (filename) {
this.type(extname(filename));
}

this.set('Content-Disposition', contentDisposition(filename));

return this;
};



res.append = function append(field, val) {
var prev = this.get(field);
var value = val;

if (prev) {

value = Array.isArray(prev) ? prev.concat(val)
: Array.isArray(val) ? [prev].concat(val)
: [prev, val];
}
