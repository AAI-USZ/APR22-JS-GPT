

var deprecate = require('depd')('express');
var escapeHtml = require('escape-html');
var http = require('http');
var isAbsolute = require('./utils').isAbsolute;
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

deprecate('res.send(status): Use res.status(status).end() instead');
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



res.sendFile = function sendFile(path, options, fn) {
var done;
var req = this.req;
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


req.socket.on('error', onerror);


function onerror(err) {
if (done) return;
done = true;


cleanup();


if (fn) return fn(err);


next(err);
}


function onstream(stream) {
if (done) return;
cleanup();
if (fn) stream.on('end', fn);
}


function cleanup() {
req.socket.removeListener('error', onerror);
}


var pathname = encodeURI(path);
var file = send(req, pathname, options);
file.on('error', onerror);
file.on('directory', next);
file.on('stream', onstream);

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

res.sendfile = deprecate.function(res.sendfile,
'res.sendfile: Use res.sendFile instead');



res.download = function(path, filename, fn){

if ('function' == typeof filename) {
fn = filename;
filename = null;
}
