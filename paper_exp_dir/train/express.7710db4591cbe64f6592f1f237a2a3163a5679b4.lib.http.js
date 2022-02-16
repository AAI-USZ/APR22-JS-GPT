




var connect = require('connect')
, router = require('./router')
, Router = require('./router')
, view = require('./view')
, toArray = require('./utils').toArray
, methods = router.methods.concat('del', 'all')
, res = require('./response')
, url = require('url')
, utils = connect.utils
, qs = require('qs');



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
this.engines = {};
this.settings = {};
this.redirects = {};
this.isCallbacks = {};

this.set('home', '/');
this.set('env', process.env.NODE_ENV || 'development');
this.use(connect.query());



this.locals = function(obj){
