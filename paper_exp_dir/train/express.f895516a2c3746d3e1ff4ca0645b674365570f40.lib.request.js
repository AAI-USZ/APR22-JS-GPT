


var http = require('http')
, utils = require('./utils')
, connect = require('connect')
, fresh = require('fresh')
, parse = connect.utils.parseUrl
, mime = connect.mime;



var req = exports = module.exports = {
__proto__: http.IncomingMessage.prototype
};



req.get =
req.header = function(name){
