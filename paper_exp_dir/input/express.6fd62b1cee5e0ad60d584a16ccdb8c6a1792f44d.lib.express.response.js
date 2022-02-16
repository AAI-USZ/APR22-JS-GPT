




var fs = require('fs'),
http = require('http'),
path = require('path'),
utils = require('connect/utils'),
mime = require('connect/utils').mime,
Buffer = require('buffer').Buffer;



http.ServerResponse.prototype.send = function(body, headers, status){

if (typeof headers === 'number') {
status = headers,
headers = null;
}


status = status || 200;
headers = headers || {};


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


utils.merge(this.headers, headers);


this.writeHead(status, this.headers);
this.end(body);
};



http.ServerResponse.prototype.sendfile = function(file){
var self = this;
fs.readFile(file, function(err, buf){
if (err) {
self.send(err.errno === process.ENOENT
? 404
: 500);
} else {
self.contentType(file);
self.send(buf);
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



http.ServerResponse.prototype.download = function(file, filename){
this.attachment(filename || file).sendfile(file);
};



http.ServerResponse.prototype.header = function(name, val){
return val === undefined
? this.headers[name]
: this.headers[name] = val;
};



http.ServerResponse.prototype.redirect = function(url, status){
var basePath = this.app.set('home') || '/';


var map = {
back: this.req.headers.referrer || this.req.headers.referer || basePath,
home: basePath
};


map.__proto__ = this.app.redirects;


var mapped = typeof map[url] === 'function'
: map[url];


this.writeHead(status || 302, { 'Location': mapped || url });
this.end();
};
