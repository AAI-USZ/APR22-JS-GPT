




var http = require('http')
, utils = require('./utils')
, mime = require('connect').utils.mime
, req = http.IncomingMessage.prototype;



var flashFormatters = exports.flashFormatters = {
s: function(val){
return String(val);
}
};



req.header = function(name, defaultValue){
switch (name = name.toLowerCase()) {
case 'referer':
case 'referrer':
return this.headers.referrer || this.headers.referer || defaultValue;
default:
return this.headers[name] || defaultValue;
}
};



req.accepts = function(type){
