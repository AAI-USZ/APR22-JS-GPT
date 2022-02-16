




var http = require('http')
, req = http.IncomingMessage.prototype
, utils = require('./utils')
, mime = require('mime');



var flashFormatters = exports.flashFormatters = {
s: function(val){
return String(val);
},

d: function(val){
return val | 0;
}
};



req.header = function(name, defaultValue){
