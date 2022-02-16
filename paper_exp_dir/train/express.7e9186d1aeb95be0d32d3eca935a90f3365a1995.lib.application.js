




var connect = require('connect')
, Router = require('./router')
, toArray = require('./utils').toArray
, methods = Router.methods.concat('del', 'all')
, res = require('./response')
, url = require('url')
, utils = connect.utils
, path = require('path')
, extname = path.extname
, join = path.join
, fs = require('fs')
, qs = require('qs');



var app = exports = module.exports = {};



app.init = function(middleware){
var self = this;
this.settings = {};
this.engines = {};
this.redirects = {};
this.isCallbacks = {};


this.set('home', '/');
this.set('env', process.env.NODE_ENV || 'development');


this.use(connect.query());



this.locals = function(obj){
for (var key in obj) {
self.locals[key] = obj[key];
}
return self;
};


this.use(function(req, res, next){
var charset;
res.setHeader('X-Powered-By', 'Express');
req.app = res.app = self;
req.res = res;
res.req = req;
req.next = next;


if (charset = self.set('charset')) res.charset = charset;



res.locals = function(obj){
for (var key in obj) {
res.locals[key] = obj[key];
}
return res;
};

next();
});


if (middleware) middleware.forEach(self.use.bind(self));


this.routes = new Router(this);
this.__defineGetter__('router', function(){
this.__usedRouter = true;
return self.routes.middleware;
});


this.locals.settings = this.settings;


this.configure('production', function(){
this.enable('view cache');
});


methods.forEach(function(method){
self.lookup[method] = function(path){
return self.routes.lookup(method, path);
};

self.match[method] = function(path){
return self.routes.match(method, path);
};

