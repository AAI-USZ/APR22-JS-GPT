




var connect = require('connect')
, Router = require('./router')
, methods = Router.methods.concat('del', 'all')
, middleware = require('./middleware')
, View = require('./view')
, url = require('url')
, utils = connect.utils
, path = require('path')
, http = require('http')
, join = path.join
, fs = require('fs')
, qs = require('qs');



var app = exports = module.exports = {};



app.init = function(){
var self = this;
this.cache = {};
this.settings = {};
this.engines = {};
this.isCallbacks = {};
this.viewCallbacks = [];
this.defaultConfiguration();


methods.forEach(function(method){
self.lookup[method] = function(path){
return self._router.lookup(method, path);
};

self.match[method] = function(path){
return self._router.match(method, path);
};

self.remove[method] = function(path){
return self._router.lookup(method, path).remove();
};
});


self.lookup.del = self.lookup.delete;
self.match.del = self.match.delete;
self.remove.del = self.remove.delete;
};



app.defaultConfiguration = function(){
var self = this;


this.set('env', process.env.NODE_ENV || 'development');


this.use(connect.query());
this.use(middleware.init(this));


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


this._router = new Router(this);
this.routes = this._router.routes;
this.__defineGetter__('router', function(){
this._usedRouter = true;
this._router.caseSensitive = this.enabled('case sensitive routing');
this._router.strict = this.enabled('strict routing');
return this._router.middleware;
});


this.locals.settings = this.settings;


this.configure('production', function(){
this.enable('view cache');
