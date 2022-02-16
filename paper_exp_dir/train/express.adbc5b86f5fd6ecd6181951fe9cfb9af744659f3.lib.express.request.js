




var http = require('http')
, utils = require('./utils')
, mime = require('connect/utils').mime;



var flashFormatters = exports.flashFormatters = {
s: function(val){
return String(val);
}
};



http.IncomingMessage.prototype.header = function(name, defaultValue){
return this.headers[name.toLowerCase()] || defaultValue;
};



http.IncomingMessage.prototype.accepts = function(type){
var accept = this.header('Accept');
if (!accept || accept === '*/*') {
return true;
} else if (type) {

if (type.indexOf('/') < 0) {
type = mime.types['.' + type];
}

if (accept.indexOf(type) >= 0) {
return true;

} else {
type = type.split('/')[0] + '/*';
return accept.indexOf(type) >= 0;
}
} else {
return false;
}
};



http.IncomingMessage.prototype.param = function(name){

if (this.params[name] !== undefined) {
return this.params[name];
}

if (this.query[name] !== undefined) {
return this.query[name];
}

if (this.body && this.body[name] !== undefined) {
return this.body[name];
}
};



http.IncomingMessage.prototype.flash = function(type, msg){
var msgs = this.session.flash = this.session.flash || {};
if (type && msg) {
var i = 2
, args = arguments
, formatters = this.app.flashFormatters || {};
formatters.__proto__ = flashFormatters;
msg = utils.miniMarkdown(utils.htmlEscape(msg));
msg = msg.replace(/%([a-zA-Z])/g, function(_, format){
var formatter = formatters[format];
if (formatter) return formatter(args[i++]);
});
return (msgs[type] = msgs[type] || []).push(msg);
} else if (type) {
var arr = msgs[type];
delete msgs[type];
return arr || [];
} else {
this.session.flash = {};
return msgs;
}
};



http.IncomingMessage.prototype.is = function(type){
var fn = this.app.is(type);
if (fn) return fn(this);
var contentType = this.headers['content-type'];
if (!contentType) return;
if (!~type.indexOf('/')) type = mime.type('.' + type);

if (~type.indexOf(';')) type = type.split(';')[0];
if (~type.indexOf('*')) {
type = type.split('/')
contentType = contentType.split('/');
if ('*' == type[0] && type[1] == contentType[1]) return true;
if ('*' == type[1] && type[0] == contentType[0]) return true;
}
return ~contentType.indexOf(type);
};



function isxhr() {
return this.header('X-Requested-With', '').toLowerCase() === 'xmlhttprequest';
