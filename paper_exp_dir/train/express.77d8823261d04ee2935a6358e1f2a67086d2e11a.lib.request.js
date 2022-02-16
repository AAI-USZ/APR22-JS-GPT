




var http = require('http')
, req = http.IncomingMessage.prototype
, utils = require('./utils')
, parse = require('url').parse
, mime = require('mime');



var defaultFormatters = exports.formatters = {
s: String
, d: function(val){ return val | 0; }
};



req.header = function(name, defaultValue){
switch (name = name.toLowerCase()) {
case 'referer':
case 'referrer':
