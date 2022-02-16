




var http = require('http')
, req = http.IncomingMessage.prototype
, utils = require('./utils')
, parse = require('url').parse
, mime = require('mime');



var defaultFormatters = exports.formatters = {
s: function(val){
return String(val);
},
d: function(val){
return val | 0;
}
