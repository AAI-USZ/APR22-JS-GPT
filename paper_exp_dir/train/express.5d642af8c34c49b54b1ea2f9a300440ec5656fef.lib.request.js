

'use strict';



var accepts = require('accepts');
var deprecate = require('depd')('express');
var isIP = require('net').isIP;
var typeis = require('type-is');
var http = require('http');
var fresh = require('fresh');
var parseRange = require('range-parser');
var parse = require('parseurl');
var proxyaddr = require('proxy-addr');



var req = exports = module.exports = {
__proto__: http.IncomingMessage.prototype
};



req.get =
req.header = function header(name) {
var lc = name.toLowerCase();

switch (lc) {
case 'referer':
case 'referrer':
return this.headers.referrer
|| this.headers.referer;
default:
return this.headers[lc];
}
};



req.accepts = function(){
var accept = accepts(this);
return accept.types.apply(accept, arguments);
};



req.acceptsEncodings = function(){
var accept = accepts(this);
return accept.encodings.apply(accept, arguments);
};

req.acceptsEncoding = deprecate.function(req.acceptsEncodings,
'req.acceptsEncoding: Use acceptsEncodings instead');



req.acceptsCharsets = function(){
var accept = accepts(this);
return accept.charsets.apply(accept, arguments);
};

req.acceptsCharset = deprecate.function(req.acceptsCharsets,
'req.acceptsCharset: Use acceptsCharsets instead');



req.acceptsLanguages = function(){
var accept = accepts(this);
return accept.languages.apply(accept, arguments);
};

req.acceptsLanguage = deprecate.function(req.acceptsLanguages,
'req.acceptsLanguage: Use acceptsLanguages instead');



req.range = function range(size, options) {
var range = this.get('Range');
if (!range) return;
return parseRange(size, range, options);
};



req.param = function param(name, defaultValue) {
var params = this.params || {};
var body = this.body || {};
var query = this.query || {};

var args = arguments.length === 1
? 'name'
: 'name, default';
deprecate('req.param(' + args + '): Use req.params, req.body, or req.query instead');

if (null != params[name] && params.hasOwnProperty(name)) return params[name];
if (null != body[name]) return body[name];
if (null != query[name]) return query[name];

return defaultValue;
};



req.is = function is(types) {
var arr = types;


if (!Array.isArray(types)) {
arr = new Array(arguments.length);
for (var i = 0; i < arr.length; i++) {
arr[i] = arguments[i];
}
}

return typeis(this, arr);
};



defineGetter(req, 'protocol', function protocol(){
var proto = this.connection.encrypted
? 'https'
: 'http';
var trust = this.app.get('trust proxy fn');

if (!trust(this.connection.remoteAddress, 0)) {
return proto;
}



proto = this.get('X-Forwarded-Proto') || proto;
return proto.split(/\s*,\s*/)[0];
});



defineGetter(req, 'secure', function secure(){
return this.protocol === 'https';
});



defineGetter(req, 'ip', function ip(){
var trust = this.app.get('trust proxy fn');
return proxyaddr(this, trust);
});



defineGetter(req, 'ips', function ips() {
var trust = this.app.get('trust proxy fn');
var addrs = proxyaddr.all(this, trust);
return addrs.slice(1).reverse();
});



defineGetter(req, 'subdomains', function subdomains() {
var hostname = this.hostname;

if (!hostname) return [];

var offset = this.app.get('subdomain offset');
var subdomains = !isIP(hostname)
? hostname.split('.').reverse()
: [hostname];

return subdomains.slice(offset);
});



defineGetter(req, 'path', function path() {
return parse(this).pathname;
});



defineGetter(req, 'hostname', function hostname(){
var trust = this.app.get('trust proxy fn');
var host = this.get('X-Forwarded-Host');

if (!host || !trust(this.connection.remoteAddress, 0)) {
host = this.get('Host');
}

if (!host) return;


var offset = host[0] === '['
? host.indexOf(']') + 1
: 0;
var index = host.indexOf(':', offset);

return index !== -1
? host.substring(0, index)
: host;
});



defineGetter(req, 'host', deprecate.function(function host(){
return this.hostname;
}, 'req.host: Use req.hostname instead'));



defineGetter(req, 'fresh', function(){
var method = this.method;
var s = this.res.statusCode;


if ('GET' !== method && 'HEAD' !== method) return false;


if ((s >= 200 && s < 300) || 304 === s) {
return fresh(this.headers, (this.res._headers || {}));
}

return false;
});



defineGetter(req, 'stale', function stale(){
return !this.fresh;
});



defineGetter(req, 'xhr', function xhr(){
var val = this.get('X-Requested-With') || '';
return val.toLowerCase() === 'xmlhttprequest';
});


function defineGetter(obj, name, getter) {
Object.defineProperty(obj, name, {
configurable: true,
enumerable: true,
get: getter
});
};
