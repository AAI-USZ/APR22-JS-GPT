




var http = require('http')
, utils = require('./utils')
, connect = require('connect')
, parse = require('url').parse
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
var ct = this.get('Content-Type');
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



req.__defineGetter__('protocol', function(){
var trustProxy = this.app.settings['trust proxy'];
return this.connection.encrypted
? 'https'
: trustProxy
? (this.get('X-Forwarded-Proto') || 'http')
: 'http';
});



req.__defineGetter__('secure', function(){
return 'https' == this.protocol;
});



req.__defineGetter__('ips', function(){
var val = this.get('X-Forwarded-For');
return val
? val.split(/ *, */).reverse()
: [];
});



req.__defineGetter__('subdomains', function(){
return this.get('Host')
.split('.')
.slice(0, -2)
.reverse();
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
var val = this.get('X-Requested-With') || '';
return 'xmlhttprequest' == val.toLowerCase();
});
