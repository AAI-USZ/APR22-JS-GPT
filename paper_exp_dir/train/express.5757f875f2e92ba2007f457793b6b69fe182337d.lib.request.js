




var http = require('http')
, utils = require('./utils')
, connect = require('connect')
, parse = require('url').parse
, mime = require('mime');



var req = exports = module.exports = {
__proto__: http.IncomingMessage.prototype
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
var fn = this.app.is(type);
if (fn) return fn(this);
var contentType = this.headers['content-type'];
if (!contentType) return;
if (!~type.indexOf('/')) type = mime.lookup(type);
if (~type.indexOf('*')) {
type = type.split('/');
contentType = contentType.split('/');
if ('*' == type[0] && type[1] == contentType[1]) return true;
if ('*' == type[1] && type[0] == contentType[0]) return true;
}
return !! ~contentType.indexOf(type);
};



req.__defineGetter__('secure', function(){
return this.connection.encrypted;
});



req.__defineGetter__('path', function(){
return parse(this.url).pathname;
});



req.__defineGetter__('fresh', function(){
return ! this.stale;
});



req.__defineGetter__('stale', function(){
return connect.utils.modified(this, this.res);
});



req.__defineGetter__('xhr', function(){
return 'xmlhttprequest' == this.header('X-Requested-With', '').toLowerCase();
});
