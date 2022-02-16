




var http = require('http')
, req = http.IncomingMessage.prototype
, utils = require('./utils')
, connect = require('connect')
, parse = require('url').parse
, mime = require('mime');



var defaultFormatters = exports.formatters = {
s: String
, d: function(val){ return val | 0; }
};



req.header = function(name, defaultValue){
switch (name = name.toLowerCase()) {
case 'referer':
case 'referrer':
return this.headers.referrer
|| this.headers.referer
|| defaultValue;
default:
return this.headers[name] || defaultValue;
}
};



req.get = function(field, param){
var val = this.header(field);
if (!val) return '';
var regexp = new RegExp(param + ' *= *(?:"([^"]+)"|([^;]+))', 'i');
if (!regexp.exec(val)) return '';
return RegExp.$1 || RegExp.$2;
};



req.accepts = function(type){
var accept = this.header('Accept')
, type = String(type);


if (!accept || '*/*' == accept) return true;


if ('.' == type[0]) type = type.substr(1);


if (!~type.indexOf('/')) type = mime.lookup(type);


