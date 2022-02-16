




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


if (type && '.' == type[0]) type = type.substr(1);


if (!accept || '*/*' == accept) {
return true;
} else if (type) {

if (type.indexOf('/') < 0) {
type = mime.types['.' + type];
}


if (~accept.indexOf(type)) return true;


type = type.split('/')[0] + '/*';
return accept.indexOf(type) >= 0;
} else {
return false;
}
};



http.IncomingMessage.prototype.param = function(name){

