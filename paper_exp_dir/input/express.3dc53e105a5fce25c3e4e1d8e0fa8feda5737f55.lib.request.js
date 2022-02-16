




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



req.accepts = function(type){
var accept = this.header('Accept');


if (type && '.' == type[0]) type = type.substr(1);


if (!accept || '*/*' == accept) {
return true;
} else if (type) {

