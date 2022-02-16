




var fs = require('fs'),
http = require('http'),
path = require('path'),
utils = require('connect/utils'),
mime = require('connect/utils').mime,
Buffer = require('buffer').Buffer;



var multiple = ['Set-Cookie'];



http.ServerResponse.prototype.send = function(body, headers, status){

if (typeof headers === 'number') {
status = headers,
headers = null;
}


status = status || 200;


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


this.writeHead(status, this.headers);
this.end(body);
};



http.ServerResponse.prototype.sendfile = function(path, fn){
var self = this;
fs.readFile(path, function(err, buf){
if (err) {
if (fn) {
fn(err, path);
} else {
self.req.next(err);
}
} else {
self.contentType(path);
self.send(buf);
fn && fn(null, path);
}
});
};



http.ServerResponse.prototype.contentType = function(type){
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



http.ServerResponse.prototype.redirect = function(url, status){
var basePath = this.app.set('home') || '/';


var map = {
back: this.req.headers.referrer || this.req.headers.referer || basePath,
home: basePath
};


map.__proto__ = this.app.redirects;


var mapped = typeof map[url] === 'function'
? map[url](this.req, this)
: map[url];


url = mapped || url;
this.end('Redirecting to ' + url);
};
