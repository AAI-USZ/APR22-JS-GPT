


var accepts = require('accepts');
var typeis = require('type-is');
var http = require('http')
, utils = require('./utils')
, fresh = require('fresh')
, parseRange = require('range-parser')
, parse = utils.parseUrl



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



req.accepts = function(){
var accept = accepts(this);
return accept.types.apply(accept, arguments);
};



req.acceptsEncoding =
req.acceptsEncodings = function(){
var accept = accepts(this);
return accept.encodings.apply(accept, arguments);
};



req.acceptsCharset =
req.acceptsCharsets = function(){
var accept = accepts(this);
return accept.charsets.apply(accept, arguments);
};



req.acceptsLanguage =
req.acceptsLanguages = function(){
var accept = accepts(this);
return accept.languages.apply(accept, arguments);
};



req.range = function(size){
var range = this.get('Range');
if (!range) return;
return parseRange(size, range);
};



req.param = function(name, defaultValue){
var params = this.params || {};
var body = this.body || {};
var query = this.query || {};
if (null != params[name] && params.hasOwnProperty(name)) return params[name];
if (null != body[name]) return body[name];
if (null != query[name]) return query[name];
return defaultValue;
};



req.is = function(types){
if (!Array.isArray(types)) types = [].slice.call(arguments);
return typeis(this, types);
};



req.__defineGetter__('protocol', function(){
var trustProxy = this.app.get('trust proxy');
if (this.connection.encrypted) return 'https';
if (!trustProxy) return 'http';
var proto = this.get('X-Forwarded-Proto') || 'http';
return proto.split(/\s*,\s*/)[0];
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


var parts = auth.split(' ');
if ('basic' != parts[0].toLowerCase()) return;
if (!parts[1]) return;
auth = parts[1];


auth = new Buffer(auth, 'base64').toString().match(/^([^:]*):(.*)$/);
if (!auth) return;
return { username: auth[1], password: auth[2] };
});



req.__defineGetter__('subdomains', function(){
var offset = this.app.get('subdomain offset');
return (this.host || '')
.split('.')
.reverse()
.slice(offset);
});



req.__defineGetter__('path', function(){
return parse(this).pathname;
});



req.__defineGetter__('host', function(){
var trustProxy = this.app.get('trust proxy');
var host = trustProxy && this.get('X-Forwarded-Host');
host = host || this.get('Host');
if (!host) return;
return host.split(':')[0];
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
