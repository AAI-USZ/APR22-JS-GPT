




var http = require('http'),
utils = require('./utils'),
mime = require('connect/utils').mime;



http.IncomingMessage.prototype.header = function(name, defaultValue){
return this.headers[name.toLowerCase()] || defaultValue;
};



http.IncomingMessage.prototype.accepts = function(type){
var accept = this.header('Accept');
if (!accept || accept === '*/*') {
