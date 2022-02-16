




var http = require('http'),
utils = require('./utils'),
mime = require('connect/utils').mime;



var flashFormatters = exports.flashFormatters = {
s: function(val){
return String(val);
}
};



http.IncomingMessage.prototype.header = function(name, defaultValue){
return this.headers[name.toLowerCase()] || defaultValue;
};
