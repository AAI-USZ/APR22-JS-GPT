




var fs = require('fs')
, http = require('http')
, path = require('path')
, connect = require('connect')
, utils = connect.utils
, normalizeType = require('./utils').normalizeType
, normalizeTypes = require('./utils').normalizeTypes
, statusCodes = http.STATUS_CODES
, send = connect.static.send
, mime = require('mime')
, basename = path.basename
, join = path.join;



var res = module.exports = {
__proto__: http.ServerResponse.prototype
};



res.status = function(code){
this.statusCode = code;
return this;
};



res.cache = function(type, options){
var val = type;
options = options || {};
if (options.maxAge) val += ', max-age=' + (options.maxAge / 1000);
return this.set('Cache-Control', val);
};



res.send = function(body){
var req = this.req
, head = 'HEAD' == req.method;


if (2 == arguments.length) {
this.statusCode = body;
body = arguments[1];
}

switch (typeof body) {

case 'number':
this.get('Content-Type') || this.contentType('.txt');
this.statusCode = body;
body = http.STATUS_CODES[body];
break;

case 'string':
if (!this.get('Content-Type')) {
this.charset = this.charset || 'utf-8';
this.contentType('.html');
}
break;
case 'boolean':
case 'object':
if (null == body) {
body = '';
} else if (Buffer.isBuffer(body)) {
this.get('Content-Type') || this.contentType('.bin');
} else {
return this.json(body);
}
break;
}


if (undefined !== body && !this.get('Content-Length')) {
this.set('Content-Length', Buffer.isBuffer(body)
? body.length
: Buffer.byteLength(body));
}


if (204 == this.statusCode || 304 == this.statusCode) {
this.removeHeader('Content-Type');
this.removeHeader('Content-Length');
body = '';
}


this.end(head ? null : body);
return this;
};



res.json = function(obj){

if (2 == arguments.length) {
this.statusCode = obj;
obj = arguments[1];
}

var settings = this.app.settings
, jsonp = settings['jsonp callback']
, replacer = settings['json replacer']
, spaces = settings['json spaces']
, body = JSON.stringify(obj, replacer, spaces)
, callback = this.req.query.callback;

this.charset = this.charset || 'utf-8';
this.set('Content-Type', 'application/json');

if (callback && jsonp) {
this.set('Content-Type', 'text/javascript');
body = callback.replace(/[^\w$.]/g, '') + '(' + body + ');';
}

return this.send(body);
};



res.sendfile = function(path, options, fn){
var self = this
, req = self.req
, next = this.req.next
, options = options || {};


if ('function' == typeof options) {
fn = options;
options = {};
}


options.callback = function(err){
if (err) {

if ('ENOENT' == err.code) err = 404;




if ('number' == typeof err) err = utils.error(err);


if (!self.headerSent) self.removeHeader('Content-Disposition');


if (fn) return fn(err);


if (self.headerSent) return;

return req.next(err);
}

fn && fn();
};


options.path = encodeURIComponent(path);
send(this.req, this, next, options);
};



res.download = function(path, filename, fn){

if ('function' == typeof filename) {
fn = filename;
filename = null;
}

return this.attachment(filename || path).sendfile(path, fn);
};



res.contentType =
res.type = function(type){
return this.set('Content-Type', mime.lookup(type));
};



res.format = function(obj){
var keys = Object.keys(obj)
, req = this.req
, next = req.next
, key = req.accepts(keys);

if (key) {
this.set('Content-Type', normalizeType(key));
obj[key](req, this, next);
} else {
var err = new Error('Not Acceptable');
err.status = 406;
err.types = normalizeTypes(keys);
next(err);
}

return this;
};



res.attachment = function(filename){
if (filename) this.type(filename);
this.set('Content-Disposition', filename
? 'attachment; filename="' + basename(filename) + '"'
: 'attachment');
return this;
};



res.set = function(field, val){
if (2 == arguments.length) {
this.setHeader(field, val);
} else {
for (var key in field) {
this.setHeader(key, field[key]);
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



res.signedCookie = function(name, val, options){
var secret = this.req.secret;
if (!secret) throw new Error('connect.cookieParser("secret") required for signed cookies');
if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
val = utils.sign(val, secret);
return this.cookie(name, val, options);
};



res.cookie = function(name, val, options){
options = options || {};
if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
if ('maxAge' in options) options.expires = new Date(Date.now() + options.maxAge);
if (null == options.path) options.path = '/';
var cookie = utils.serializeCookie(name, val, options);
this.set('Set-Cookie', cookie);
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


if (!~url.indexOf('://')) {
var path = app.path();


if (0 == url.indexOf('./') || 0 == url.indexOf('..')) {
url = req.path + '/' + url;

} else if ('/' != url[0]) {
url = path + '/' + url;
}


var host = req.get('Host');
url = req.protocol + '://' + host + url;
}


this.format({
'text/plain': function(){
body = statusCodes[status] + '. Redirecting to ' + url;
},

'text/html': function(){
body = '<p>' + statusCodes[status] + '. Redirecting to <a href="' + url + '">' + url + '</a></p>';
}
})


this.statusCode = status;
this.set('Location', url);
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

function render() {

options.locals = self.locals;


fn = fn || function(err, str){
if (err) return req.next(err);
self.send(str);
};


app.render(view, options, fn);
}


var callbacks = app.viewCallbacks
, pending = callbacks.length
, len = pending
, done;

if (len) {
for (var i = 0; i < len; ++i) {
callbacks[i](req, self, function(err){
if (done) return;

if (err) {
req.next(err);
done = true;
return;
}

--pending || render();
});
}
} else {
render();
}
};
