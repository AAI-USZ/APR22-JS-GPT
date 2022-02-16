




var qs = require('qs')
, connect = require('connect')
, router = require('./router')
, Router = require('./router')
, view = require('./view')
, toArray = require('./utils').toArray
, methods = router.methods.concat('del', 'all')
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
this.settings = {};
this.redirects = {};
this.isCallbacks = {};
this._locals = {};
this.dynamicViewHelpers = {};

this.set('home', '/');
this.set('env', process.env.NODE_ENV || 'development');


this.use(function(req, res, next){
req.query = req.query || {};
res.setHeader('X-Powered-By', 'Express');
req.app = res.app = self;
req.res = res;
res.req = req;
