

var http = require('http')
, path = require('path')
, connect = require('connect')
, utils = connect.utils
, sign = require('cookie-signature').sign
, normalizeType = require('./utils').normalizeType
, normalizeTypes = require('./utils').normalizeTypes
, etag = require('./utils').etag
, statusCodes = http.STATUS_CODES
, cookie = require('cookie')
, send = require('send')
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



res.links = function(links){
return this.set('Link', Object.keys(links).map(function(rel){
return '<' + links[rel] + '>; rel="' + rel + '"';
}).join(', '));
};



res.send = function(body){
var req = this.req;
var head = 'HEAD' == req.method;
var len;


if (2 == arguments.length) {

if ('number' != typeof body && 'number' == typeof arguments[1]) {
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



if (len > 1024 && 'GET' == req.method) {
if (!this.get('ETag')) {
this.set('ETag', etag(body));
}
}


if (req.fresh) this.statusCode = 304;


if (204 == this.statusCode || 304 == this.statusCode) {
this.removeHeader('Content-Type');
this.removeHeader('Content-Length');
this.removeHeader('Transfer-Encoding');
body = '';
}


this.end(head ? null : body);
return this;
};



res.json = function(obj){

if (2 == arguments.length) {

if ('number' == typeof arguments[1]) {
this.statusCode = arguments[1];
} else {
this.statusCode = obj;
obj = arguments[1];
}
}


var app = this.app;
var replacer = app.get('json replacer');
var spaces = app.get('json spaces');
var body = JSON.stringify(obj, replacer, spaces);


this.charset = this.charset || 'utf-8';
this.get('Content-Type') || this.set('Content-Type', 'application/json');

return this.send(body);
};



res.jsonp = function(obj){

if (2 == arguments.length) {

if ('number' == typeof arguments[1]) {
this.statusCode = arguments[1];
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


this.charset = this.charset || 'utf-8';
this.set('Content-Type', 'application/json');


if (callback) {
if (callback instanceof Array) callback = callback[0];
this.set('Content-Type', 'text/javascript');
var cb = callback.replace(/[^\[\]\w$.]/g, '');
body = cb + ' && ' + cb + '(' + body + ');';
}

return this.send(body);
};



res.sendfile = function(path, options, fn){
