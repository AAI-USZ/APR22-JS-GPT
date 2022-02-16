

var fs = require('fs')
, http = require('http')
, path = require('path')
, connect = require('connect')
, utils = connect.utils
, normalizeType = require('./utils').normalizeType
, normalizeTypes = require('./utils').normalizeTypes
, statusCodes = http.STATUS_CODES
, send = connect.static.send
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



res.send = require('response-send');



res.json = function(obj){

if (2 == arguments.length) {

if ('number' == typeof arguments[1]) {
this.statusCode = arguments[1];
} else {
this.statusCode = obj;
obj = arguments[1];
}
}


var app = this.app
, jsonp = app.get('jsonp callback')
, replacer = app.get('json replacer')
, spaces = app.get('json spaces')
, body = JSON.stringify(obj, replacer, spaces)
, callback = this.req.query[app.get('jsonp callback name')];


this.charset = this.charset || 'utf-8';
this.set('Content-Type', 'application/json');


if (callback && jsonp) {
this.set('Content-Type', 'text/javascript');
body = callback.replace(/[^[]\w$.]/g, '') + '(' + body + ');';
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


req.socket.removeListener('error', error);
if (!self.headerSent) self.removeHeader('Content-Disposition');


if (fn) return fn(err);


if (self.headerSent) return;


next(err);
}


function stream() {
if (done) return;
req.socket.removeListener('error', error);
if (fn) self.on('finish', fn);
}


var file = send(req, path);
if (options.root) file.root(options.root);
file.maxage(options.maxAge || 0);
file.on('error', error);
file.on('directory', next);
file.on('stream', stream);
file.pipe(this);
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
var keys = Object.keys(obj)
, req = this.req
, next = req.next;

var fn = obj.default;
if (fn) delete obj.default;

var key = req.accepts(keys);

this.set('Vary', 'Accept');

if (key) {
this.set('Content-Type', normalizeType(key));
obj[key](req, this, next);
} else if (fn) {
fn();
} else {
var err = new Error('Not Acceptable');
err.status = 406;
err.types = normalizeTypes(keys);
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
this.setHeader(field, '' + val);
} else {
for (var key in field) {
this.setHeader(key, '' + field[key]);
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
? utils.merge(opts, options)
: opts);
};



res.cookie = function(name, val, options){
options = options || {};
var secret = this.req.secret;
var signed = options.signed;
if (signed && !secret) throw new Error('connect.cookieParser("secret") required for signed cookies');
if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
if (signed) val = utils.sign(val, secret);
if ('maxAge' in options) options.expires = new Date(Date.now() + options.maxAge);
if (null == options.path) options.path = '/';
this.set('Set-Cookie', cookie.serialize(name, String(val), options));
return this;
};



res.redirect = function(url){
var app = this.app
, req = this.req
, head = 'HEAD' == req.method
, status = 302
, body;


if (2 == arguments.length) {
status = url;
url = arguments[1];
}


var map = { back: req.get('Referrer') || '/' };


url = map[url] || url;


if (!~url.indexOf('://') && 0 != url.indexOf('//')) {
var path = app.path();


if ('.' == url[0]) {
url = req.path + '/' + url;

} else if ('/' != url[0]) {
url = path + '/' + url;
}


var host = req.get('Host');
url = '//' + host + url;
}


this.format({
text: function(){
body = statusCodes[status] + '. Redirecting to ' + url;
},

html: function(){
body = '<p>' + statusCodes[status] + '. Redirecting to <a href="' + url + '">' + url + '</a></p>';
},

default: function(){
body = '';
}
});


this.statusCode = status;
this.set('Location', url);
this.set('Content-Length', Buffer.byteLength(body));
this.end(head ? null : body);
};



res.render = function(view, options, fn){
var self = this
, options = options || {}
, req = this.req
, app = req.app;


if ('function' == typeof options) {
fn = options, options = {};
}


options.locals = self.locals;


fn = fn || function(err, str){
if (err) return req.next(err);
self.send(str);
};


app.render(view, options, fn);
};
