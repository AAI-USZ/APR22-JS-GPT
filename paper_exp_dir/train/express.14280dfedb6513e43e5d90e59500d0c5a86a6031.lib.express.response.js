




var http = require('http'),
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
if (!(body instanceof Buffer)) {
if (!this.headers['Content-Type']) {
this.contentType('.json');
}
body = JSON.stringify(body);
}
break;
}


if (!this.headers['Content-Length']) {
