

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



res.send = function(body){
var req = this.req;
var head = 'HEAD' == req.method;
var type;
var encoding;
var len;


var app = this.app;


if (2 == arguments.length) {

if ('number' != typeof body && 'number' == typeof arguments[1]) {
deprecate('res.send(body, status): Use res.send(status, body) instead');
this.statusCode = arguments[1];
} else {
this.statusCode = body;
body = arguments[1];
}
}

switch (typeof body) {

case 'number':
this.get('Content-Type') || this.type('txt');
this.statusCode = body;
body = http.STATUS_CODES[body];
break;

case 'string':
if (!this.get('Content-Type')) this.type('html');
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


if ('string' === typeof body) {
encoding = 'utf8';
type = this.get('Content-Type');


if ('string' === typeof type) {
this.set('Content-Type', setCharset(type, 'utf-8'));
}
}


if (undefined !== body && !this.get('Content-Length')) {
len = Buffer.isBuffer(body)
? body.length
: Buffer.byteLength(body, encoding);
this.set('Content-Length', len);
}


var etag = len !== undefined && app.get('etag fn');
if (etag && ('GET' === req.method || 'HEAD' === req.method)) {
if (!this.get('ETag')) {
etag = etag(body, encoding);
etag && this.set('ETag', etag);
}
}


if (req.fresh) this.statusCode = 304;


if (204 == this.statusCode || 304 == this.statusCode) {
this.removeHeader('Content-Type');
this.removeHeader('Content-Length');
this.removeHeader('Transfer-Encoding');
body = '';
}


this.end((head ? null : body), encoding);

return this;
};



res.json = function(obj){

if (2 == arguments.length) {

if ('number' == typeof arguments[1]) {
this.statusCode = arguments[1];
if (typeof obj === 'number') {
deprecate('res.json(obj, status): Use res.json(status, obj) instead');
} else {
deprecate('res.json(num, status): Use res.status(status).json(num) instead');
}
} else {
this.statusCode = obj;
obj = arguments[1];
}
}


var app = this.app;
var replacer = app.get('json replacer');
var spaces = app.get('json spaces');
var body = JSON.stringify(obj, replacer, spaces);


this.get('Content-Type') || this.set('Content-Type', 'application/json');

return this.send(body);
};



res.jsonp = function(obj){

if (2 == arguments.length) {

if ('number' == typeof arguments[1]) {
this.statusCode = arguments[1];
if (typeof obj === 'number') {
deprecate('res.jsonp(obj, status): Use res.jsonp(status, obj) instead');
} else {
deprecate('res.jsonp(num, status): Use res.status(status).jsonp(num) instead');
}
} else {
this.statusCode = obj;
obj = arguments[1];
}
}


var app = this.app;
var replacer = app.get('json replacer');
var spaces = app.get('json spaces');
var body = JSON.stringify(obj, replacer, spaces)
.replace(/\u2028/g, '\\u2028')
.replace(/\u2029/g, '\\u2029');
var callback = this.req.query[app.get('jsonp callback name')];


this.get('Content-Type') || this.set('Content-Type', 'application/json');


if (Array.isArray(callback)) {
callback = callback[0];
}


if (callback && 'string' === typeof callback) {
this.set('Content-Type', 'text/javascript');
var cb = callback.replace(/[^\[\]\w$.]/g, '');
body = 'typeof ' + cb + ' === \'function\' && ' + cb + '(' + body + ');';
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
