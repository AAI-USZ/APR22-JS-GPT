




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
