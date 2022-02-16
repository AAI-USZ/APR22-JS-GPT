




var connect = require('connect')
, HTTPServer = require('./http')
, https = require('https');



exports = module.exports = HTTPSServer;



var app = HTTPSServer.prototype;



function HTTPSServer(options, middleware){
connect.HTTPSServer.call(this, options, []);
this.init(middleware);
};
