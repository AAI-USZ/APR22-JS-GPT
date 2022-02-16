




var connect = require('connect')
, HTTPSServer = require('./https')
, HTTPServer = require('./http')
, Route = require('./router/route')



var exports = module.exports = connect.middleware;



exports.version = '2.3.0';



exports.createServer = function(options){
if ('object' == typeof options) {
return new HTTPSServer(options, Array.prototype.slice.call(arguments, 1));
