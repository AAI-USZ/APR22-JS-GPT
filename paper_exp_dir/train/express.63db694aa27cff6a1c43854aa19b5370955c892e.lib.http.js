




var qs = require('qs')
, connect = require('connect')
, router = require('./router')
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


this.use(function(req, res, next){
req.query = req.query || {};
res.setHeader('X-Powered-By', 'Express');
req.app = res.app = self;
req.res = res;
res.req = req;
req.next = next;

if (req.url.indexOf('?') > 0) {
var query = url.parse(req.url).query;
req.query = qs.parse(query);
}
next();
});


if (middleware) middleware.forEach(self.use.bind(self));


var fn = router(function(app){ self.routes = app; });
this.__defineGetter__('router', function(){
this.__usedRouter = true;
return fn;
});


this.locals({
settings: this.settings
, app: this
});


this.configure('development', function(){
this.enable('hints');
});


this.configure('production', function(){
this.enable('view cache');
});



this.on('listening', this.registerErrorHandlers.bind(this));


methods.forEach(function(method){
self.match[method] = function(url){
return self.router.match(url, 'all' == method
? null
: method);
};

self.lookup[method] = function(path){
return self.router.lookup(path, 'all' == method
? null
: method);
};
});
};



Server.prototype.onvhost = function(){
this.registerErrorHandlers();
};



Server.prototype.registerErrorHandlers = function(){
this.errorHandlers.forEach(function(fn){
this.use(function(err, req, res, next){
fn.apply(this, arguments);
});
}, this);
return this;
};



Server.prototype.use = function(route, middleware){
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



Server.prototype.mounted = function(fn){
this.__mounted = fn;
return this;
};



Server.prototype.register = function(){
view.register.apply(this, arguments);
return this;
};



Server.prototype.helpers =
Server.prototype.locals = function(obj){
utils.merge(this._locals, obj);
return this;
};



Server.prototype.dynamicHelpers = function(obj){
utils.merge(this.dynamicViewHelpers, obj);
return this;
};



Server.prototype.param = function(name, fn){
if (Array.isArray(name)) {
name.forEach(function(name){
this.param(name, fn);
}, this);
} else {
if (':' == name[0]) name = name.substr(1);
this.routes.param(name, fn);
}
return this;
};



Server.prototype.error = function(fn){
this.errorHandlers.push(fn);
return this;
};



Server.prototype.is = function(type, fn){
if (!fn) return this.isCallbacks[type];
this.isCallbacks[type] = fn;
return this;
};



Server.prototype.set = function(setting, val){
if (val === undefined) {
if (this.settings.hasOwnProperty(setting)) {
return this.settings[setting];
} else if (this.parent) {
return this.parent.set(setting);
}
} else {
this.settings[setting] = val;
return this;
}
};



Server.prototype.enabled = function(setting){
return !!this.set(setting);
};



Server.prototype.disabled = function(setting){
return !this.set(setting);
};



Server.prototype.enable = function(setting){
return this.set(setting, true);
};



Server.prototype.disable = function(setting){
return this.set(setting, false);
};



Server.prototype.redirect = function(key, url){
this.redirects[key] = url;
return this;
};



Server.prototype.configure = function(env, fn){
if ('function' == typeof env) {
fn = env, env = 'all';
}
if ('all' == env || env == this.settings.env) {
fn.call(this);
}
return this;
};



function generateMethod(method){
Server.prototype[method] = function(path){
var self = this;


if (1 == arguments.length) {
return this.router.lookup(path, 'all' == method
? null
: method);
}


if (!this.__usedRouter) this.use(this.router);


this.routes[method].apply(this, arguments);
return this;
};
return arguments.callee;
}

methods.forEach(generateMethod);



Server.prototype.del = Server.prototype.delete;
