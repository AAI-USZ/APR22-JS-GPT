




var http = require('http');



http.IncomingMessage.prototype.header = function(name, defaultValue){
return this.headers[name.toLowerCase()] || defaultValue;
};

http.IncomingMessage.prototype.param = function(name){
