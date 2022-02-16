




var qs = require('qs')
, connect = require('connect')
, router = require('./router')
, Router = require('./router')
, view = require('./view')
, toArray = require('./utils').toArray
, methods = router.methods.concat('del', 'all')
, res = require('./response')
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
req.query = req.query || {};
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


this.configure('development', function(){
this.enable('hints');
});


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

self.remove[method] = function(path){
return self.routes.lookup(method, path).remove();
};
});


self.lookup.del = self.lookup.delete;
self.match.del = self.match.delete;
self.remove.del = self.remove.delete;
};



app.remove = function(path){
return this.routes.lookup('all', path).remove();
};



app.lookup = function(path){
return this.routes.lookup('all', path);
};



app.match = function(url){
return this.routes.match('all', url);
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

connect.HTTPServer.prototype.use.call(this, route, middleware);



if (app) {
home = app.set('home');
if ('/' == home) home = '';
app.set('home', app.route + home);
app.parent = this;
if (app.__mounted) app.__mounted.call(app, this);
}

return this;
};



app.mounted = function(fn){
this.__mounted = fn;
return this;
};



app.register = function(){
view.register.apply(this, arguments);
return this;
};



app.helpers =
app.locals = function(obj){
utils.merge(this._locals, obj);
return this;
};



app.dynamicHelpers = function(obj){
utils.merge(this.dynamicViewHelpers, obj);
return this;
