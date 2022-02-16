

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
if (code === undefined || code === null) {
throw new TypeError('code argument is required to res.status')
}

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
if (Buffer.isBuffer(chunk)) {

len = chunk.length
} else if (!generateETag && chunk.length < 1000) {

len = Buffer.byteLength(chunk, encoding)
} else {

chunk = Buffer.from(chunk, encoding)
encoding = undefined;
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
var escape = app.get('json escape')
var replacer = app.get('json replacer');
var spaces = app.get('json spaces');
var body = stringify(val, replacer, spaces, escape)


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
var escape = app.get('json escape')
var replacer = app.get('json replacer');
var spaces = app.get('json spaces');
var body = stringify(val, replacer, spaces, escape)
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

if (typeof path !== 'string') {
throw new TypeError('path must be a string to res.sendFile')
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


if (err && err.code !== 'ECONNABORTED' && err.syscall !== 'write') {
next(err);
}
});
};

res.sendfile = deprecate.function(res.sendfile,
'res.sendfile: Use res.sendFile instead');



res.download = function download (path, filename, options, callback) {
var done = callback;
var name = filename;
var opts = options || null


if (typeof filename === 'function') {
done = filename;
name = null;
opts = null
} else if (typeof options === 'function') {
done = options
opts = null
}


var headers = {
'Content-Disposition': contentDisposition(name || path)
};


if (opts && opts.headers) {
var keys = Object.keys(opts.headers)
for (var i = 0; i < keys.length; i++) {
var key = keys[i]
if (key.toLowerCase() !== 'content-disposition') {
headers[key] = opts.headers[key]
}
}
}


opts = Object.create(opts)
opts.headers = headers


var fullPath = resolve(path);


return this.sendFile(fullPath, opts, done)
};



res.contentType =
res.type = function contentType(type) {
var ct = type.indexOf('/') === -1
? mime.lookup(type)
: type;

return this.set('Content-Type', ct);
};



res.format = function(obj){
var req = this.req;
var next = req.next;

var fn = obj.default;
if (fn) delete obj.default;
var keys = Object.keys(obj);

var key = keys.length > 0
? req.accepts(keys)
: false;

this.vary("Accept");

if (key) {
this.set('Content-Type', normalizeType(key).value);
obj[key](req, this, next);
} else if (fn) {
fn();
} else {
var err = new Error('Not Acceptable');
err.status = err.statusCode = 406;
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

return this.set(field, value);
};



res.set =
res.header = function header(field, val) {
if (arguments.length === 2) {
var value = Array.isArray(val)
? val.map(String)
: String(val);


if (field.toLowerCase() === 'content-type') {
if (Array.isArray(value)) {
throw new TypeError('Content-Type cannot be set to an Array');
}
if (!charsetRegExp.test(value)) {
var charset = mime.charsets.lookup(value.split(';')[0]);
if (charset) value += '; charset=' + charset.toLowerCase();
}
}

this.setHeader(field, value);
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



res.clearCookie = function clearCookie(name, options) {
var opts = merge({ expires: new Date(1), path: '/' }, options);

return this.cookie(name, '', opts);
};



res.cookie = function (name, value, options) {
var opts = merge({}, options);
var secret = this.req.secret;
var signed = opts.signed;

if (signed && !secret) {
throw new Error('cookieParser("secret") required for signed cookies');
}

var val = typeof value === 'object'
? 'j:' + JSON.stringify(value)
: String(value);

if (signed) {
val = 's:' + sign(val, secret);
}

if ('maxAge' in opts) {
opts.expires = new Date(Date.now() + opts.maxAge);
opts.maxAge /= 1000;
}

if (opts.path == null) {
opts.path = '/';
}

this.append('Set-Cookie', cookie.serialize(name, String(val), opts));

return this;
};



res.location = function location(url) {
var loc = url;


if (url === 'back') {
loc = this.req.get('Referrer') || '/';
}


return this.set('Location', encodeUrl(loc));
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
deprecate('res.redirect(url, status): Use res.redirect(status, url) instead');
status = arguments[1];
}
}


address = this.location(address).get('Location');


this.format({
text: function(){
body = statuses[status] + '. Redirecting to ' + address
},

html: function(){
var u = escapeHtml(address);
body = '<p>' + statuses[status] + '. Redirecting to <a href="' + u + '">' + u + '</a></p>'
},

default: function(){
body = '';
}
});


this.statusCode = status;
this.set('Content-Length', Buffer.byteLength(body));

if (this.req.method === 'HEAD') {
this.end();
} else {
this.end(body);
}
};



res.vary = function(field){

if (!field || (Array.isArray(field) && !field.length)) {
deprecate('res.vary(): Provide a field name');
return this;
}

vary(this, field);

return this;
};



res.render = function render(view, options, callback) {
var app = this.req.app;
var done = callback;
var opts = options || {};
var req = this.req;
var self = this;


if (typeof options === 'function') {
done = options;
opts = {};
}


opts._locals = self.locals;


done = done || function (err, str) {
if (err) return req.next(err);
self.send(str);
};


app.render(view, opts, done);
};


function sendfile(res, file, options, callback) {
var done = false;
var streaming;


function onaborted() {
if (done) return;
done = true;

var err = new Error('Request aborted');
err.code = 'ECONNABORTED';
callback(err);
}


function ondirectory() {
if (done) return;
done = true;

var err = new Error('EISDIR, read');
err.code = 'EISDIR';
callback(err);
}


function onerror(err) {
if (done) return;
done = true;
callback(err);
}


function onend() {
if (done) return;
done = true;
callback();
}


function onfile() {
streaming = false;
}


function onfinish(err) {
if (err && err.code === 'ECONNRESET') return onaborted();
if (err) return onerror(err);
if (done) return;

setImmediate(function () {
if (streaming !== false && !done) {
onaborted();
return;
}

if (done) return;
done = true;
callback();
});
}


function onstream() {
streaming = true;
}

file.on('directory', ondirectory);
file.on('end', onend);
file.on('error', onerror);
file.on('file', onfile);
file.on('stream', onstream);
onFinished(res, onfinish);

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


file.pipe(res);
}



function stringify (value, replacer, spaces, escape) {


var json = replacer || spaces
? JSON.stringify(value, replacer, spaces)
: JSON.stringify(value);

if (escape) {
json = json.replace(/[<>&]/g, function (c) {
switch (c.charCodeAt(0)) {
case 0x3c:
return '\\u003c'
case 0x3e:
return '\\u003e'
case 0x26:
return '\\u0026'
default:
return c
}
})
}

return json
}
