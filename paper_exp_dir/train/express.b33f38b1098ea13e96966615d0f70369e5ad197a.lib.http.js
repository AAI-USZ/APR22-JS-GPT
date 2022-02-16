




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



app.__proto__ = connect.HTTPServer.prototype;



app.init = function(middleware){
var self = this;
this.cache = {};
this.match = {};
this.lookup = {};
this.settings = {};
this.redirects = {};
this.isCallbacks = {};
this._locals = {};
this.dynamicViewHelpers = {};
this.errorHandlers = [];

this.set('home', '/');
this.set('env', process.env.NODE_ENV || 'development');
