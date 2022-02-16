




var connect = require('connect')
, Router = require('./router')
, toArray = require('./utils').toArray
, methods = Router.methods.concat('del', 'all')
, res = require('./response')
, View = require('./view')
, url = require('url')
, utils = connect.utils
, path = require('path')
, join = path.join
, fs = require('fs')
, qs = require('qs');



var app = exports = module.exports = {};



app.init = function(){
var self = this;
this.cache = {};
this.settings = {};
this.engines = {};
this.redirects = {};
this.isCallbacks = {};
this.viewCallbacks = [];
this.defaultConfiguration();


methods.forEach(function(method){
self.lookup[method] = function(path){
return self.routes.lookup(method, path);
};

self.match[method] = function(path){
return self.routes.match(method, path);
};

self.remove[method] = function(path){
return self.routes.lookup(method, path).remove();
};
});


self.lookup.del = self.lookup.delete;
self.match.del = self.match.delete;
self.remove.del = self.remove.delete;
};



app.defaultConfiguration = function(){
var self = this;


this.set('home', '/');
this.set('env', process.env.NODE_ENV || 'development');


this.use(connect.query());

this.locals = function(obj){
for (var key in obj) self.locals[key] = obj[key];
return self;
};

this.locals.use = function(fn){
if (3 == fn.length) {
self.viewCallbacks.push(fn);
} else {
self.viewCallbacks.push(function(req, res, done){
fn(req, res);
done();
});
}
return this;
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
for (var key in obj) res.locals[key] = obj[key];
return res;
};

next();
});


this.routes = new Router(this);
this.routeList = this.routes.routes;
this.__defineGetter__('router', function(){
this.__usedRouter = true;
return self.routes.middleware;
});


this.locals.settings = this.settings;


this.configure('production', function(){
this.enable('view cache');
