




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
var self = this;

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
fs.readFile(path, function(err, buf){
if (err) return error(err);
self.contentType(path);
self.send(buf);
fn && fn(null, path);
});
});
};
