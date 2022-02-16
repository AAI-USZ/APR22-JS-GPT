




var qs = require('qs')
, connect = require('connect')
, router = require('./router')
, methods = router.methods.concat(['del', 'all'])
, view = require('./view')
, url = require('url')
, utils = connect.utils;



exports = module.exports = HTTPServer;



var app = HTTPServer.prototype;



function HTTPServer(middleware){
connect.HTTPServer.call(this, []);
this.init(middleware);
};
