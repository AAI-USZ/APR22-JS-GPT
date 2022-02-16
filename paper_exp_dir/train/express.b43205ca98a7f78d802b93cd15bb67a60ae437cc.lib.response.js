

var deprecate = require('depd')('express');
var escapeHtml = require('escape-html');
var http = require('http');
var path = require('path');
var mixin = require('utils-merge');
var sign = require('cookie-signature').sign;
var normalizeType = require('./utils').normalizeType;
var normalizeTypes = require('./utils').normalizeTypes;
var setCharset = require('./utils').setCharset;
var contentDisposition = require('./utils').contentDisposition;
var statusCodes = http.STATUS_CODES;
var cookie = require('cookie');
var send = require('send');
var basename = path.basename;
var extname = path.extname;
var mime = send.mime;
var vary = require('vary');



var res = module.exports = {
__proto__: http.ServerResponse.prototype
};



res.status = function(code){
this.statusCode = code;
return this;
};



res.links = function(links){
var link = this.get('Link') || '';
if (link) link += ', ';
return this.set('Link', link + Object.keys(links).map(function(rel){
return '<' + links[rel] + '>; rel="' + rel + '"';
}).join(', '));
};



res.send = function send(body) {
var chunk = body;
var encoding;
var len;
var req = this.req;
var type;


var app = this.app;


if (arguments.length === 2) {

if (typeof arguments[0] !== 'number' && typeof arguments[1] === 'number') {
deprecate('res.send(body, status): Use res.send(status, body) instead');
this.statusCode = arguments[1];
} else {
this.statusCode = arguments[0];
chunk = arguments[1];
}
}


if (typeof chunk === 'number' && arguments.length === 1) {

if (!this.get('Content-Type')) {
this.type('txt');
}

this.statusCode = chunk;
chunk = http.STATUS_CODES[chunk];
}

switch (typeof chunk) {

case 'string':
if (!this.get('Content-Type')) {
this.type('html');
}
break;
case 'boolean':
case 'number':
case 'object':
if (chunk === null) {
chunk = '';
} else if (Buffer.isBuffer(chunk)) {
if (!this.get('Content-Type')) {
this.type('bin');
}
} else {
return this.json(chunk);
}
break;
}


if (typeof chunk === 'string') {
encoding = 'utf8';
type = this.get('Content-Type');


if (typeof type === 'string') {
this.set('Content-Type', setCharset(type, 'utf-8'));
}
}


if (chunk !== undefined) {
if (!Buffer.isBuffer(chunk)) {

chunk = new Buffer(chunk, encoding);
encoding = undefined;
}

len = chunk.length;
this.set('Content-Length', len);
}


