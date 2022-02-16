




var connect = require('connect')
, HTTPServer = require('./http')
, https = require('https');



var Server = exports = module.exports = function HTTPSServer(options, middleware){
connect.HTTPSServer.call(this, options, []);
this.init(middleware);
};



Server.prototype.__proto__ = connect.HTTPSServer.prototype;



Object.keys(HTTPServer.prototype).forEach(function(method){
Server.prototype[method] = HTTPServer.prototype[method];
