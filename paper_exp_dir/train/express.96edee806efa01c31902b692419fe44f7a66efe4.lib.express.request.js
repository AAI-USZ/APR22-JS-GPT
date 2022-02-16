




var http = require('http'),
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

if (this.params.path[name] !== undefined) {
return this.params.path[name];
}

if (this.params.get[name] !== undefined) {
return this.params.get[name];
}
