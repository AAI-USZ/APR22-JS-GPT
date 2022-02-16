




var qs = require('qs')
, connect = require('connect')
, router = connect.router
, methods = router.methods.concat(['del', 'all'])
, view = require('./view')
, url = require('url')
, utils = connect.utils;



var Server = exports = module.exports = function HTTPServer(middleware){
connect.HTTPServer.call(this, []);
this.init(middleware);
};



Server.prototype.__proto__ = connect.HTTPServer.prototype;



Server.prototype.init = function(middleware){
