




var http = require('http'),
path = require('path'),
utils = require('connect/utils'),
mime = require('connect/utils').mime,
Buffer = require('buffer').Buffer;



http.ServerResponse.prototype.send = function(body, headers, status){
status = status || 200;
headers = headers || {};
switch (typeof body) {
case 'string':
if (!this.headers['Content-Type']) {
this.contentType('.html');
}
break;
case 'object':
if (!this.headers['Content-Type']) {
this.contentType('.json');
}
body = JSON.stringify(body);
break;
}
utils.merge(headers, this.headers);
this.header('Content-Length', Buffer.byteLength(body));
this.writeHead(status, headers);
this.end(body);
};



http.ServerResponse.prototype.contentType = function(type){
return this.header('Content-Type', mime.type(type));
};



http.ServerResponse.prototype.header = function(name, val){
this.headers = this.headers || {};
return val === undefined
? this.headers[name]
: this.headers[name] = val;
};
