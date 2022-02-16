




var http = require('http'),
path = require('path'),
mime = require('connect/utils').mime,
Buffer = require('buffer').Buffer;



http.ServerResponse.prototype.send = function(body, headers, status){
status = status || 200;
headers = headers || {};
switch (typeof body) {
case 'string':
headers['Content-Type'] = 'text/html; charset=utf8';
break;
case 'object':
headers['Content-Type'] = 'application/json; charset=utf8';
body = JSON.stringify(body);
break;
}
headers['Content-Length'] = Buffer.byteLength(body);
this.writeHead(status, headers);
this.end(body);
};



http.ServerResponse.prototype.contentType = function(type){
return this.headers['Content-Type'] = mime.type(type);
};
