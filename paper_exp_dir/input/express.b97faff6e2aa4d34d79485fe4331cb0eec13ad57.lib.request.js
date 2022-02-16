

'use strict';



var accepts = require('accepts');
var deprecate = require('depd')('express');
var isIP = require('net').isIP;
var typeis = require('type-is');
var http = require('http');
var fresh = require('fresh');
var parseRange = require('range-parser');
var parse = require('parseurl');
var proxyaddr = require('proxy-addr');



var req = Object.create(http.IncomingMessage.prototype)



module.exports = req



req.get =
req.header = function header(name) {
if (!name) {
throw new TypeError('name argument is required to req.get');
}

if (typeof name !== 'string') {
throw new TypeError('name must be a string to req.get');
}

var lc = name.toLowerCase();

switch (lc) {
case 'referer':
case 'referrer':
return this.headers.referrer
|| this.headers.referer;
default:
return this.headers[lc];
}
};



req.accepts = function(){
var accept = accepts(this);
return accept.types.apply(accept, arguments);
};



req.acceptsEncodings = function(){
var accept = accepts(this);
return accept.encodings.apply(accept, arguments);
};

req.acceptsEncoding = deprecate.function(req.acceptsEncodings,
'req.acceptsEncoding: Use acceptsEncodings instead');



req.acceptsCharsets = function(){
var accept = accepts(this);
return accept.charsets.apply(accept, arguments);
};

req.acceptsCharset = deprecate.function(req.acceptsCharsets,
'req.acceptsCharset: Use acceptsCharsets instead');



req.acceptsLanguages = function(){
var accept = accepts(this);
return accept.languages.apply(accept, arguments);
};

req.acceptsLanguage = deprecate.function(req.acceptsLanguages,
'req.acceptsLanguage: Use acceptsLanguages instead');



req.range = function range(size, options) {
var range = this.get('Range');
if (!range) return;
return parseRange(size, range, options);
};



req.param = function param(name, defaultValue) {
var params = this.params || {};
var body = this.body || {};
var query = this.query || {};

var args = arguments.length === 1
? 'name'
: 'name, default';
deprecate('req.param(' + args + '): Use req.params, req.body, or req.query instead');

if (null != params[name] && params.hasOwnProperty(name)) return params[name];
if (null != body[name]) return body[name];
if (null != query[name]) return query[name];

return defaultValue;
};



req.is = function is(types) {
var arr = types;


if (!Array.isArray(types)) {
arr = new Array(arguments.length);
for (var i = 0; i < arr.length; i++) {
arr[i] = arguments[i];
}
}

return typeis(this, arr);
};



defineGetter(req, 'protocol', function protocol(){
var proto = this.connection.encrypted
? 'https'
: 'http';
var trust = this.app.get('trust proxy fn');

if (!trust(this.connection.remoteAddress, 0)) {
return proto;
}



