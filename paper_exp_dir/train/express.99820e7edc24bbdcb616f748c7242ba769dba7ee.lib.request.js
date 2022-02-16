




var http = require('http')
, utils = require('./utils')
, mime = require('connect').utils.mime
, req = http.IncomingMessage.prototype;



var flashFormatters = exports.flashFormatters = {
s: function(val){
return String(val);
}
};



req.header = function(name, defaultValue){
