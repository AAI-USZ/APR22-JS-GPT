




var http = require('http')
, req = http.IncomingMessage.prototype
, utils = require('./utils')
, mime = require('mime');



var flashFormatters = exports.flashFormatters = {
s: function(val){
return String(val);
}
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
var regexp = new RegExp(key + ' *= *(?:"([^"]+)"|([^;]+))', 'i');
if (!regexp.exec(val)) return '';
return RegExp.$1 || RegExp.$2;
};



