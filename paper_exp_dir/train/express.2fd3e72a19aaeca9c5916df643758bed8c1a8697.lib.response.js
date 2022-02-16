

var http = require('http');
var path = require('path');
var mixin = require('utils-merge');
var escapeHtml = require('escape-html');
var sign = require('cookie-signature').sign;
var normalizeType = require('./utils').normalizeType;
var normalizeTypes = require('./utils').normalizeTypes;
var contentDisposition = require('./utils').contentDisposition;
var etag = require('./utils').etag;
var statusCodes = http.STATUS_CODES;
var cookie = require('cookie');
var send = require('send');
var basename = path.basename;
var extname = path.extname;
var mime = send.mime;



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
var len;


var app = this.app;


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


if (undefined !== body && !this.get('Content-Length')) {
this.set('Content-Length', len = Buffer.isBuffer(body)
? body.length
: Buffer.byteLength(body));
}



if (app.settings.etag && len && 'GET' == req.method) {
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


this.set('Content-Type', 'application/json');


if (callback) {
if (Array.isArray(callback)) callback = callback[0];
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
if (!self.headersSent) self.removeHeader('Content-Disposition');


if (fn) return fn(err);


if (self.headersSent) return;


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
file.pipe(this);
this.on('finish', cleanup);
};
