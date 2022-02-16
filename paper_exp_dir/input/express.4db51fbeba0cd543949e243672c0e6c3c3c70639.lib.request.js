

var accepts = require('accepts');
var deprecate = require('depd')('express');
var isIP = require('net').isIP;
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



var params = this.params || {};
var body = this.body || {};
var query = this.query || {};
