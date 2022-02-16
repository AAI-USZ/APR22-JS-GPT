




var fs = require('fs')
, http = require('http')
, path = require('path')
, utils = require('connect').utils
, parseRange = require('./utils').parseRange
, res = http.ServerResponse.prototype
, mime = utils.mime;



var multiple = ['Set-Cookie'];



res.send = function(body, headers, status){

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



res.sendfile = function(path, fn){
var self = this
, ranges = self.req.headers.range
, head = 'HEAD' == self.req.method;

if (~path.indexOf('..')) return this.send(403);

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
var status = 200;


if (ranges) {
ranges = parseRange(stat.size, ranges);

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
return self.send(416);
}

} else {
var stream = fs.createReadStream(path);
self.header('Content-Length', stat.size);
}


self.contentType(path);
self.header('Accept-Ranges', 'bytes');
self.writeHead(status, self.headers);
if (head) return self.end();
stream.pipe(self);
fn && fn(null, path, stream);
});
};



res.contentType = function(type){
if (!~type.indexOf('.')) type = '.' + type;
return this.header('Content-Type', mime.type(type));
};



res.attachment = function(filename){
