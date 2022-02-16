

var http = require('http')
, path = require('path')
, connect = require('connect')
, mixin = require('utils-merge')
, escapeHtml = require('escape-html')
, sign = require('cookie-signature').sign
, normalizeType = require('./utils').normalizeType
, normalizeTypes = require('./utils').normalizeTypes
, etag = require('./utils').etag
, statusCodes = http.STATUS_CODES
, cookie = require('cookie')
, send = require('send')
, mime = connect.mime
, resolve = require('url').resolve
, basename = path.basename
, extname = path.extname;



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
if (Array.isArray(callback)) callback = callback[0];
this.set('Content-Type', 'text/javascript');
var cb = callback.replace(/[^\[\]\w$.]/g, '');
body = 'typeof ' + cb + ' === \'function\' && ' + cb + '(' + body + ');';
}

return this.send(body);
};



res.sendfile = function(path, options, fn){
var self = this
, req = self.req
, next = this.req.next
, options = options || {}
, done;


if ('function' == typeof options) {
fn = options;
options = {};
}


req.socket.on('error', error);


function error(err) {
if (done) return;
done = true;


cleanup();
if (!self.headerSent) self.removeHeader('Content-Disposition');


if (fn) return fn(err);


if (self.headerSent) return;


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


var file = send(req, path);
if (options.root) file.root(options.root);
file.maxage(options.maxAge || 0);
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
this.set('Content-Disposition', 'attachment; filename="' + basename(filename) + '"');
return this.sendfile(path, fn);
};



res.contentType =
res.type = function(type){
return this.set('Content-Type', ~type.indexOf('/')
? type
: mime.lookup(type));
};



res.format = function(obj){
var req = this.req
, next = req.next;

var fn = obj.default;
if (fn) delete obj.default;
var keys = Object.keys(obj);

var key = req.accepts(keys);

this.vary("Accept");

if (key) {
var type = normalizeType(key).value;
var charset = mime.charsets.lookup(type);
if (charset) type += '; charset=' + charset;
this.set('Content-Type', type);
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
this.set('Content-Disposition', filename
? 'attachment; filename="' + basename(filename) + '"'
: 'attachment');
return this;
};



res.set =
res.header = function(field, val){
if (2 == arguments.length) {
if (Array.isArray(val)) val = val.map(String);
else val = String(val);
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
if (signed && !secret) throw new Error('connect.cookieParser("secret") required for signed cookies');
if ('number' == typeof val) val = val.toString();
if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
if (signed) val = 's:' + sign(val, secret);
if ('maxAge' in options) {
options.expires = new Date(Date.now() + options.maxAge);
options.maxAge /= 1000;
}
if (null == options.path) options.path = '/';
this.set('Set-Cookie', cookie.serialize(name, String(val), options));
return this;
};




res.location = function(url){
var app = this.app
, req = this.req
, path;


if ('back' == url) url = req.get('Referrer') || '/';


if (!~url.indexOf('://') && 0 != url.indexOf('//')) {

if ('.' == url[0]) {
path = req.originalUrl.split('?')[0];
path = path + ('/' == path[path.length - 1] ? '' : '/');
url = resolve(path, url);

} else if ('/' != url[0]) {
path = app.path();
url = path + '/' + url;
}
}


this.set('Location', url);
return this;
};



res.redirect = function(url){
var head = 'HEAD' == this.req.method
, status = 302
, body;


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
var self = this
, options = options || {}
, req = this.req
, app = req.app;


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
