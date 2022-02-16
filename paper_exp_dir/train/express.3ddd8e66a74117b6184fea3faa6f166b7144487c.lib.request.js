


var http = require('http')
, utils = require('./utils')
, connect = require('connect')
, fresh = require('fresh')
, parseRange = require('range-parser')
, parse = connect.utils.parseUrl
, mime = connect.mime;



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



req.accepts = function(type){
var args = arguments.length > 1 ? [].slice.apply(arguments) : type;
return utils.accepts(args, this.get('Accept'));
};



req.acceptsEncoding = function(encoding){
return !! ~this.acceptedEncodings.indexOf(encoding);
};



req.acceptsCharset = function(charset){
var accepted = this.acceptedCharsets;
