


var auth = require('basic-auth');
var deprecate = require('depd')('express');
var http = require('http')
, utils = require('./utils')
, connect = require('connect')
, fresh = require('fresh')
, parseRange = require('range-parser')
, parse = require('parseurl')
, proxyaddr = require('proxy-addr')
, mime = connect.mime;
var isIP = require('net').isIP;



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
return accepted.length
? !! ~accepted.indexOf(charset)
: true;
};



req.acceptsLanguage = function(lang){
var accepted = this.acceptedLanguages;
return accepted.length
? !! ~accepted.indexOf(lang)
: true;
};



req.range = function(size){
var range = this.get('Range');
if (!range) return;
return parseRange(size, range);
};



req.__defineGetter__('acceptedEncodings', function(){
var accept = this.get('Accept-Encoding');
return accept
? accept.trim().split(/ *, */)
: [];
});



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
.parseParams(accept)
.map(function(obj){
return obj.value;
})
: [];
});



req.__defineGetter__('acceptedCharsets', function(){
var accept = this.get('Accept-Charset');
return accept
? utils
.parseParams(accept)
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
var proto = this.connection.encrypted
? 'https'
: 'http';
var trust = this.app.get('trust proxy fn');

if (!trust(this.connection.remoteAddress)) {
return proto;
}



proto = this.get('X-Forwarded-Proto') || proto;
return proto.split(/\s*,\s*/)[0];
});



req.__defineGetter__('secure', function(){
return 'https' == this.protocol;
});



req.__defineGetter__('ip', function(){
var trust = this.app.get('trust proxy fn');
return proxyaddr(this, trust);
});



req.__defineGetter__('ips', function(){
var trust = this.app.get('trust proxy fn');
var addrs = proxyaddr.all(this, trust);
return addrs.slice(1).reverse();
});



req.__defineGetter__('auth', function(){
deprecate('req.auth: Use basic-auth npm module instead');


var creds = auth(this);
if (!creds) return;

return { username: creds.name, password: creds.pass };
});



req.__defineGetter__('subdomains', function(){
var host = this.host;

if (!host) return [];

var offset = this.app.get('subdomain offset');
var subdomains = !isIP(host)
? host.split('.').reverse()
: [host];

return subdomains.slice(offset);
});



req.__defineGetter__('path', function(){
return parse(this).pathname;
});



req.__defineGetter__('host', function(){
var trust = this.app.get('trust proxy fn');
var host = this.get('X-Forwarded-Host');

if (!host || !trust(this.connection.remoteAddress)) {
host = this.get('Host');
}

if (!host) return;


var offset = host[0] === '['
? host.indexOf(']') + 1
: 0;
var index = host.indexOf(':', offset);

return ~index
? host.substring(0, index)
: host;
});



req.__defineGetter__('fresh', function(){
var method = this.method;
var s = this.res.statusCode;


if ('GET' != method && 'HEAD' != method) return false;


if ((s >= 200 && s < 300) || 304 == s) {
return fresh(this.headers, (this.res._headers || {}));
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
