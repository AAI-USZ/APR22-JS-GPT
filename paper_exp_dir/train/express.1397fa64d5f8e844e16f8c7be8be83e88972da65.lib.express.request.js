




var http = require('http');



http.IncomingMessage.prototype.header = function(name, defaultValue){
return this.headers[name.toLowerCase()] || defaultValue;
};



function isxhr() {
return this.header('X-Requested-With', '').toLowerCase() === 'xmlhttprequest';
