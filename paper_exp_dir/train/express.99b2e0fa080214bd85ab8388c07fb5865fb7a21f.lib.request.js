


var http = require('http')
, utils = require('./utils')
, connect = require('connect')
, parse = connect.utils.parseUrl
, mime = require('mime');



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
return utils.accepts(type, this.get('Accept'));
};



req.acceptsCharset = function(charset){
var accepted = this.acceptedCharsets;
return accepted.length
? ~accepted.indexOf(charset)
: true;
};



req.acceptsLanguage = function(lang){
var accepted = this.acceptedLanguages;
return accepted.length
? ~accepted.indexOf(lang)
: true;
};



req.__defineGetter__('accepted', function(){
var accept = this.get('Accept');
return accept
? utils.parseAccept(accept)
: [];
});



req.__defineGetter__('acceptedLanguages', function(){
var accept = this.get('Accept-Language');
return accept
? utils
.parseQuality(accept)
.map(function(obj){
return obj.value;
})
: [];
});



req.__defineGetter__('acceptedCharsets', function(){
var accept = this.get('Accept-Charset');
return accept
? utils
.parseQuality(accept)
.map(function(obj){
return obj.value;
})
: [];
});



req.param = function(name, defaultValue){
var params = this.params || {};
var body = this.body || {};
var query = this.query || {};
if (null != params[name]) return params[name];
if (null != body[name]) return body[name];
if (null != query[name]) return query[name];
return defaultValue;
};



req.is = function(type){
