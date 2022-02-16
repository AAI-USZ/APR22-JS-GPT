




var http = require('http');



http.IncomingMessage.prototype.header = function(name, defaultValue){
return this.headers[name.toLowerCase()] || defaultValue;
};

http.IncomingMessage.prototype.param = function(name){
if (this.params.path[name] !== undefined) {
return this.params.path[name];
}
if (this.params.get[name] !== undefined) {
return this.params.get[name];
}
};


