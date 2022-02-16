




var http = require('http'),
utils = require('./utils'),
mime = require('connect/utils').mime;



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

if (this.params.get[name] !== undefined) {
return this.params.get[name];
}

if (this.body && this.body[name] !== undefined) {
return this.body[name];
}
};



http.IncomingMessage.prototype.flash = function(type, msg){
var msgs = this.session.flash = this.session.flash || {};
if (type && msg) {
msg = utils.miniMarkdown(utils.htmlEscape(msg));
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



function isxhr() {
return this.header('X-Requested-With', '').toLowerCase() === 'xmlhttprequest';
}



http.IncomingMessage.prototype.__defineGetter__('isXMLHttpRequest', isxhr);
http.IncomingMessage.prototype.__defineGetter__('xhr', isxhr);
