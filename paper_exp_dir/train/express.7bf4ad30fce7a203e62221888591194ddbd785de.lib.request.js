


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



req.range = function(size){
var range = this.get('Range');
if (!range) return;
return parseRange(size, range);
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
if (null != params[name] && params.hasOwnProperty(name)) return params[name];
if (null != body[name]) return body[name];
if (null != query[name]) return query[name];
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
var trustProxy = this.app.get('trust proxy');
return this.connection.encrypted
? 'https'
: trustProxy
? (this.get('X-Forwarded-Proto') || 'http')
: 'http';
});



req.__defineGetter__('secure', function(){
return 'https' == this.protocol;
});



req.__defineGetter__('ip', function(){
return this.ips[0] || this.connection.remoteAddress;
});



req.__defineGetter__('ips', function(){
var trustProxy = this.app.get('trust proxy');
var val = this.get('X-Forwarded-For');
return trustProxy && val
? val.split(/ *, */)
: [];
});



req.__defineGetter__('auth', function(){

var auth = this.get('Authorization');
if (!auth) return;


auth = auth.split(' ')[1];
if (!auth) return;


auth = new Buffer(auth, 'base64').toString().split(':');
return { username: auth[0], password: auth[1] };
});



req.__defineGetter__('subdomains', function(){
return this.get('Host')
.split('.')
.slice(0, -2)
.reverse();
});



req.__defineGetter__('path', function(){
return parse(this).pathname;
});



req.__defineGetter__('host', function(){
return this.get('Host').split(':')[0];
});



req.__defineGetter__('fresh', function(){
var method = this.method;
var s = this.res.statusCode;


if ('GET' != method && 'HEAD' != method) return false;


if ((s >= 200 && s < 300) || 304 == s) {
return fresh(this.headers, this.res._headers);
}

return false;
});



req.__defineGetter__('stale', function(){
return !this.fresh;
});



req.__defineGetter__('xhr', function(){
var val = this.get('X-Requested-With') || '';
return 'xmlhttprequest' == val.toLowerCase();
});
