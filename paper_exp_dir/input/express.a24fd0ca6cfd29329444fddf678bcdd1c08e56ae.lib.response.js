

'use strict';



var Buffer = require('safe-buffer').Buffer
var contentDisposition = require('content-disposition');
var deprecate = require('depd')('express');
var encodeUrl = require('encodeurl');
var escapeHtml = require('escape-html');
var http = require('http');
var isAbsolute = require('./utils').isAbsolute;
var onFinished = require('on-finished');
var path = require('path');
var statuses = require('statuses')
var merge = require('utils-merge');
var sign = require('cookie-signature').sign;
var normalizeType = require('./utils').normalizeType;
var normalizeTypes = require('./utils').normalizeTypes;
var setCharset = require('./utils').setCharset;
var cookie = require('cookie');
var send = require('send');
var extname = path.extname;
var mime = send.mime;
var resolve = path.resolve;
var vary = require('vary');



var res = Object.create(http.ServerResponse.prototype)



module.exports = res



var charsetRegExp = /;\s*charset\s*=/;



res.status = function status(code) {
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
chunk = statuses[chunk]
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


var etagFn = app.get('etag fn')
var generateETag = !this.get('ETag') && typeof etagFn === 'function'


var len
if (chunk !== undefined) {
if (!generateETag && chunk.length < 1000) {

len = Buffer.byteLength(chunk, encoding)
} else if (!Buffer.isBuffer(chunk)) {

chunk = Buffer.from(chunk, encoding)
encoding = undefined;
len = chunk.length
} else {

len = chunk.length
}

this.set('Content-Length', len);
}


var etag;
if (generateETag && len !== undefined) {
if ((etag = etagFn(chunk, encoding))) {
this.set('ETag', etag);
}
}


if (req.fresh) this.statusCode = 304;


if (204 === this.statusCode || 304 === this.statusCode) {
this.removeHeader('Content-Type');
this.removeHeader('Content-Length');
this.removeHeader('Transfer-Encoding');
chunk = '';
}

if (req.method === 'HEAD') {

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
var body = stringify(val, replacer, spaces);


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
var body = stringify(val, replacer, spaces);
var callback = this.req.query[app.get('jsonp callback name')];


if (!this.get('Content-Type')) {
this.set('X-Content-Type-Options', 'nosniff');
this.set('Content-Type', 'application/json');
}


if (Array.isArray(callback)) {
callback = callback[0];
}


if (typeof callback === 'string' && callback.length !== 0) {
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
var body = statuses[statusCode] || String(statusCode)

this.statusCode = statusCode;
this.type('txt');

return this.send(body);
};



res.sendFile = function sendFile(path, options, callback) {
var done = callback;
var req = this.req;
var res = this;
var next = req.next;
var opts = options || {};

if (!path) {
throw new TypeError('path argument is required to res.sendFile');
}


if (typeof options === 'function') {
done = options;
opts = {};
}

if (!opts.root && !isAbsolute(path)) {
throw new TypeError('path must be absolute or specify root to res.sendFile');
}


var pathname = encodeURI(path);
var file = send(req, pathname, opts);


sendfile(res, file, opts, function (err) {
if (done) return done(err);
if (err && err.code === 'EISDIR') return next();


if (err && err.code !== 'ECONNABORTED' && err.syscall !== 'write') {
next(err);
}
});
};



res.sendfile = function (path, options, callback) {
var done = callback;
var req = this.req;
var res = this;
var next = req.next;
var opts = options || {};


if (typeof options === 'function') {
done = options;
opts = {};
}


var file = send(req, path, opts);


sendfile(res, file, opts, function (err) {
if (done) return done(err);
if (err && err.code === 'EISDIR') return next();


if (err && err.code !== 'ECONNABORT' && err.syscall !== 'write') {
next(err);
}
});
};

res.sendfile = deprecate.function(res.sendfile,
'res.sendfile: Use res.sendFile instead');



var done = callback;
var name = filename;

