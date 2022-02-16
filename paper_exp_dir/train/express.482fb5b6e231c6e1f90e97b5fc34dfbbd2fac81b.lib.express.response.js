




var fs = require('fs')
, http = require('http')
, path = require('path')
, pump = require('sys').pump
, utils = require('connect').utils
, parseRange = require('./utils').parseRange
, mime = utils.mime;



var multiple = ['Set-Cookie'];



http.ServerResponse.prototype.send = function(body, headers, status){

if (typeof headers === 'number') {
status = headers,
headers = null;
}


status = status || 200;


if (!arguments.length) {
body = status = 204;
}


switch (typeof body) {
case 'number':
if (!this.headers['Content-Type']) {
this.contentType('.txt');
}
body = http.STATUS_CODES[status = body];
break;
case 'string':
if (!this.headers['Content-Type']) {
this.contentType('.html');
}
break;
case 'object':
if (body instanceof Buffer) {
if (!this.headers['Content-Type']) {
this.contentType('.bin');
}
} else {
if (!this.headers['Content-Type']) {
this.contentType('.json');
}
body = JSON.stringify(body);
if (this.req.query.callback && this.app.settings['jsonp callback']) {
this.header('Content-Type', 'text/javascript');
body = this.req.query.callback.replace(/[^\w$.]/g, '') + '(' + body + ');';
}
}
break;
}


if (!this.headers['Content-Length']) {
this.header('Content-Length', body instanceof Buffer
? body.length
: Buffer.byteLength(body));
}


if (headers) {
var fields = Object.keys(headers);
for (var i = 0, len = fields.length; i < len; ++i) {
var field = fields[i];
this.header(field, headers[field]);
}
}


if (204 === status) {
delete this.headers['Content-Type'];
delete this.headers['Content-Length'];
}


this.writeHead(status, this.headers);
this.end('HEAD' == this.req.method ? undefined : body);
};



http.ServerResponse.prototype.sendfile = function(path, fn){
var self = this
, streamThreshold = this.app.set('stream threshold') || 32 * 1024
, ranges = self.req.headers.range;

if (~path.indexOf('..')) this.send(403);

function error(err) {
delete self.headers['Content-Disposition'];
if (fn) {
fn(err, path);
} else {
self.req.next(err);
}
}

fs.stat(path, function(err, stat){
if (err) return error(err);
if (stat.size >= streamThreshold) {
var status = 200;
if (ranges) ranges = parseRange(stat.size, ranges);
if (ranges) {
var stream = fs.createReadStream(path, ranges[0])
, start = ranges[0].start
, end = ranges[0].end;
status = 206;
self.header('Content-Range', 'bytes '
+ start
+ '-'
+ end
+ '/'
+ stat.size);
} else {
var stream = fs.createReadStream(path);
}
self.contentType(path);
self.header('Accept-Ranges', 'bytes');
self.writeHead(status, self.headers);
pump(stream, self, function(err){
fn && fn(err, path, true);
});
} else {
fs.readFile(path, function(err, buf){
if (err) return error(err);
self.contentType(path);
self.send(buf);
fn && fn(null, path);
});
}
});
};



http.ServerResponse.prototype.contentType = function(type){
if (!~type.indexOf('.')) type = '.' + type;
return this.header('Content-Type', mime.type(type));
};



http.ServerResponse.prototype.attachment = function(filename){
this.header('Content-Disposition', filename
? 'attachment; filename="' + path.basename(filename) + '"'
: 'attachment');
return this;
};



http.ServerResponse.prototype.download = function(path, filename, fn){
this.attachment(filename || path).sendfile(path, fn);
};



http.ServerResponse.prototype.header = function(name, val){
if (val === undefined) {
return this.headers[name];
} else {
if (this.headers[name] && ~multiple.indexOf(name)) {
return this.headers[name] += '\r\n' + name + ': ' + val;
} else {
return this.headers[name] = val;
}
}
};



http.ServerResponse.prototype.clearCookie = function(name){
this.cookie(name, '', { expires: new Date(1) });
};



http.ServerResponse.prototype.cookie = function(name, val, options){
var cookie = utils.serializeCookie(name, val, options);
this.header('Set-Cookie', cookie);
};



http.ServerResponse.prototype.redirect = function(url, status){
var basePath = this.app.set('home') || '/'
, status = status || 302
, body;


var map = {
back: this.req.headers.referrer || this.req.headers.referer || basePath,
home: basePath
};


map.__proto__ = this.app.redirects;


var mapped = typeof map[url] === 'function'
? map[url](this.req, this)
: map[url];


url = mapped || url;


if (this.req.accepts('html')) {
body = '<p>' + http.STATUS_CODES[status] + '. Redirecting to <a href="' + url + '">' + url + '</a></p>';
this.header('Content-Type', 'text/html');
} else {
body = http.STATUS_CODES[status] + '. Redirecting to ' + url;
this.header('Content-Type', 'text/plain');
}


this.send(body, { Location: url }, status);
};



http.ServerResponse.prototype.local = function(name, val){
this.locals = this.locals || {};
return undefined === val
? this.locals[name]
: this.locals[name] = val;
};

