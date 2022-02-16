




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


this._router = new Router(this);
this.routes = this._router.routes;
this.__defineGetter__('router', function(){
this.__usedRouter = true;
return self._router.middleware;
});


this.locals.settings = this.settings;


this.configure('production', function(){
this.enable('view cache');
});
};



app.remove = function(path){
return this._router.lookup('all', path).remove();
};



app.lookup = function(path){
return this._router.lookup('all', path);
};



app.match = function(url){
return this._router.match('all', url);
};



app.use = function(route, middleware){
var app, home, handle;

if ('string' != typeof route) {
middleware = route, route = '/';
}


if (middleware.handle && middleware.set) app = middleware;


if (app) {
app.route = route;
middleware = function(req, res, next) {
var orig = req.app;
app.handle(req, res, function(err){
req.app = res.app = orig;
next(err);
});
};
}

connect.proto.use.call(this, route, middleware);



if (app) {
base = this.set('basepath') || this.route;
if ('/' == base) base = '';
base = base + (app.set('basepath') || app.route);
app.set('basepath', base);
app.parent = this;
if (app.__mounted) app.__mounted.call(app, this);
}

return this;
};



app.mounted = function(fn){
this.__mounted = fn;
return this;
};



app.register = function(ext, fn){
if ('.' != ext[0]) ext = '.' + ext;
this.engines[ext] = fn;
return this;
};



app.param = function(name, fn){
var self = this
, fns = [].slice.call(arguments, 1);


if (Array.isArray(name)) {
name.forEach(function(name){
fns.forEach(function(fn){
self.param(name, fn);
});
});

} else if ('function' == typeof name) {
this._router.param(name);
