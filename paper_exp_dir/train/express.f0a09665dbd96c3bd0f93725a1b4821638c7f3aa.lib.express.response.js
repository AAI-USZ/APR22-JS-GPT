




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