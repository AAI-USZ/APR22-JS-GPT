




var http = require('http')
, req = http.IncomingMessage.prototype
, utils = require('./utils')
, mime = require('mime');



var flashFormatters = exports.flashFormatters = {
s: function(val){
return String(val);
}
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



req.accepts = function(type){
var accept = this.header('Accept');


if (type && '.' == type[0]) type = type.substr(1);


if (!accept || '*/*' == accept) {
return true;
} else if (type) {

if (type.indexOf('/') < 0) {
type = mime.lookup(type);
}


if (~accept.indexOf(type)) return true;


type = type.split('/')[0] + '/*';
return accept.indexOf(type) >= 0;
} else {
return false;
}
};



req.param = function(name, defaultValue){

if (this.params && this.params.hasOwnProperty(name) && undefined !== this.params[name]) {
return this.params[name];
}

if (undefined !== this.query[name]) {
return this.query[name];
}

if (this.body && undefined !== this.body[name]) {
return this.body[name];
}
return defaultValue;
};



req.flash = function(type, msg){
if (this.session === undefined) throw Error('You must enable session middleware!');
var msgs = this.session.flash = this.session.flash || {};
if (type && msg) {
var i = 2
, args = arguments
, formatters = this.app.flashFormatters || {};
formatters.__proto__ = flashFormatters;
msg = utils.miniMarkdown(utils.htmlEscape(msg));
msg = msg.replace(/%([a-zA-Z])/g, function(_, format){
var formatter = formatters[format];
