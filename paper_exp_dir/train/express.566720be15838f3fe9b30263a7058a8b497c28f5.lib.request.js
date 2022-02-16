


var http = require('http')
, utils = require('./utils')
, connect = require('connect')
, fresh = require('fresh')
, parseRange = require('range-parser')
, parse = require('parseurl')
, proxyaddr = require('proxy-addr')
, mime = connect.mime;



var req = exports = module.exports = {
__proto__: http.IncomingMessage.prototype
};



req.get =
req.header = function(name){
switch (name = name.toLowerCase()) {
