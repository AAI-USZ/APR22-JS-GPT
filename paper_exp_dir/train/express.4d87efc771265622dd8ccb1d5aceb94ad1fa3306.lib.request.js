




var http = require('http')
, utils = require('./utils')
, connect = require('connect')
, parse = require('url').parse
, mime = require('mime');



var req = exports = module.exports = {
__proto__: http.IncomingMessage.prototype
};



req.header =
req.get = function(name){
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
return utils.accepts(type, this.header('Accept'));
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
var accept = this.header('Accept');
return accept
? utils.parseAccept(accept)
: [];
});



req.__defineGetter__('acceptedLanguages', function(){
var accept = this.header('Accept-Language');
return accept
? utils
.parseQuality(accept)
.map(function(obj){
return obj.value;
})
: [];
});



req.__defineGetter__('acceptedCharsets', function(){
var accept = this.header('Accept-Charset');
return accept
? utils
.parseQuality(accept)
.map(function(obj){
return obj.value;
})
: [];
});



req.param = function(name, defaultValue){

if (this.body && undefined !== this.body[name]) return this.body[name];


if (this.params
&& this.params.hasOwnProperty(name)
&& undefined !== this.params[name]) {
return this.params[name];
}


if (undefined !== this.query[name]) return this.query[name];

return defaultValue;
};



req.is = function(type){
var ct = this.headers['content-type'];
if (!ct) return false;
ct = ct.split(';')[0];
if (!~type.indexOf('/')) type = mime.lookup(type);
if (~type.indexOf('*')) {
type = type.split('/');
ct = ct.split('/');
if ('*' == type[0] && type[1] == ct[1]) return true;
if ('*' == type[1] && type[0] == ct[0]) return true;
return false;
}
return !! ~ct.indexOf(type);
};



req.__defineGetter__('protocol', function(trustProxy){
var trustProxy = this.app.settings['trust proxy'];
return this.secure
? 'https'
: trustProxy
? (this.get('X-Forwarded-Proto') || 'http')
: 'http';
});



req.__defineGetter__('secure', function(){
