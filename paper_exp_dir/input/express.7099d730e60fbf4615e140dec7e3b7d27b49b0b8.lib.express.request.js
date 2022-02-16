




var http = require('http');



http.IncomingMessage.prototype.header = function(name, defaultValue){
return this.headers[name.toLowerCase()] || defaultValue;
};



http.IncomingMessage.prototype.accepts = function(type){
var accept = this.header('Accept'),
type = String(type).trim();
if (!accept || accept === '*/*') {
return true;
} else {
return type
? accept.indexOf(type) >= 0
: false;
}
};


http.IncomingMessage.prototype.param = function(name){

if (this.params.path[name] !== undefined) {
return this.params.path[name];
}

if (this.params.get[name] !== undefined) {
return this.params.get[name];
}

if (this.body && this.body[name] !== undefined) {
return this.body[name];
}
};




function isxhr() {
return this.header('X-Requested-With', '').toLowerCase() === 'xmlhttprequest';
}



http.IncomingMessage.prototype.__defineGetter__('isXMLHttpRequest', isxhr);
http.IncomingMessage.prototype.__defineGetter__('xhr', isxhr);
