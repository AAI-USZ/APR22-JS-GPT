

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



if (app.settings.etag && len && ('GET' == req.method || 'HEAD' == req.method)) {
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



res.download = function(path, filename, fn){

if ('function' == typeof filename) {
fn = filename;
filename = null;
}

filename = filename || path;
this.set('Content-Disposition', contentDisposition(filename));
return this.sendfile(path, fn);
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
res.header = function(field, val){
if (2 == arguments.length) {
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



res.redirect = function(url){
var head = 'HEAD' == this.req.method;
var status = 302;
var body;


if (2 == arguments.length) {
if ('number' == typeof url) {
status = url;
url = arguments[1];
} else {
status = arguments[1];
}
}


this.location(url);
url = this.get('Location');


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
this.end(head ? null : body);
};



res.vary = function(field){
var self = this;


if (!field) return this;


if (Array.isArray(field)) {
field.forEach(function(field){
self.vary(field);
});
return;
}

var vary = this.get('Vary');


if (vary) {
vary = vary.split(/ *, */);
if (!~vary.indexOf(field)) vary.push(field);
this.set('Vary', vary.join(', '));
return this;
}


this.set('Vary', field);
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
