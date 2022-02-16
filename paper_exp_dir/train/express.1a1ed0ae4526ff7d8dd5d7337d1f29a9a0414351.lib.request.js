




var http = require('http')
, req = http.IncomingMessage.prototype
, utils = require('./utils')
, connect = require('connect')
, parse = require('url').parse
, mime = require('mime');



var defaultFormatters = exports.formatters = {
s: String
, d: function(val){ return val | 0; }
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
var accept = this.header('Accept')
, type = String(type);


if (!accept || '*/*' == accept) return true;


if ('.' == type[0]) type = type.substr(1);


if (!~type.indexOf('/')) type = mime.lookup(type);


if (~accept.indexOf(type)) return true;


type = type.split('/')[0] + '/*';
return !! ~accept.indexOf(type);
};



req.param = function(name, defaultValue){

if (this.params
&& this.params.hasOwnProperty(name)
&& undefined !== this.params[name]) {
return this.params[name];
}

if (undefined !== this.query[name]) return this.query[name];


if (this.body && undefined !== this.body[name]) return this.body[name];

return defaultValue;
};



req.notify = function(type, msg){
var sess = this.session;
if (null == sess) throw Error('req.notify() requires sessions');
var msgs = sess.notifications = sess.notifications || {};

switch (arguments.length) {

case 0:
sess.notifications = {};
return msgs

case 1:
var arr = msgs[type];
delete msgs[type];
return arr || [];

default:
var i = 2
, args = arguments
, formatters = this.app.formatters || {};
formatters.__proto__ = defaultFormatters;
msg = utils.miniMarkdown(msg);
msg = msg.replace(/%([a-zA-Z])/g, function(_, format){
var formatter = formatters[format];
if (formatter) return formatter(utils.escape(args[i++]));
});
return (msgs[type] = msgs[type] || []).push(msg);
}
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
return req.connection.encrypted;
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



function isxhr() {
return this.header('X-Requested-With', '').toLowerCase() === 'xmlhttprequest';
}



req.__defineGetter__('isXMLHttpRequest', isxhr);
req.__defineGetter__('xhr', isxhr);
