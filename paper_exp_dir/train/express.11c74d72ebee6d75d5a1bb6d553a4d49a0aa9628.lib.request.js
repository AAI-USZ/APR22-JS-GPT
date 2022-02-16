

var accepts = require('accepts');
var deprecate = require('depd')('express');
var typeis = require('type-is');
var http = require('http');
var fresh = require('fresh');
var parseRange = require('range-parser');
var parse = require('parseurl');
var proxyaddr = require('proxy-addr');



var req = exports = module.exports = {
__proto__: http.IncomingMessage.prototype
};



req.get =
req.header = function(name){
switch (name = name.toLowerCase()) {
case 'referer':
case 'referrer':
return this.headers.referrer
|| this.headers.referer;
default:
return this.headers[name];
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



req.range = function(size){
var range = this.get('Range');
if (!range) return;
return parseRange(size, range);
};



req.param = function(name, defaultValue){
var params = this.params || {};
var body = this.body || {};
var query = this.query || {};
if (null != params[name] && params.hasOwnProperty(name)) return params[name];
if (null != body[name]) return body[name];
if (null != query[name]) return query[name];
return defaultValue;
};



req.is = function(types){
if (!Array.isArray(types)) types = [].slice.call(arguments);
return typeis(this, types);
};



defineGetter(req, 'protocol', function protocol(){
var proto = this.connection.encrypted
? 'https'
: 'http';
var trust = this.app.get('trust proxy fn');

if (!trust(this.connection.remoteAddress)) {
return proto;
}



proto = this.get('X-Forwarded-Proto') || proto;
