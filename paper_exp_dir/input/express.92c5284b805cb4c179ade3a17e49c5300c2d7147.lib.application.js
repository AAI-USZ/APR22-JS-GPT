




var connect = require('connect')
, Router = require('./router')
, toArray = require('./utils').toArray
, methods = Router.methods.concat('del', 'all')
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


this.set('root', '/');
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

req.__proto__ = self.request;
res.__proto__ = self.response;

res.locals = function(obj){
for (var key in obj) res.locals[key] = obj[key];
return res;
};

next();
});


this._router = new Router(this);
this.routes = this._router.routes;
this.__defineGetter__('router', function(){
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
var root = this.get('root') || this.route;
if ('/' == root) root = '';
root = root + (app.get('root') || app.route);
app.set('root', root);
app.parent = this;
if (app.__mounted) app.__mounted.call(app, this);
}

return this;
};



app.mounted = function(fn){
this.__mounted = fn;
return this;
};



app.engine = function(ext, fn){
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

} else {
if (':' == name[0]) name = name.substr(1);
fns.forEach(function(fn){
self._router.param(name, fn);
});
}

return this;
};



app.is = function(type, fn){
if (!fn) return this.isCallbacks[type];
this.isCallbacks[type] = fn;
return this;
};



app.set = function(setting, val){
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



app.enabled = function(setting){
return !!this.set(setting);
};



app.disabled = function(setting){
return !this.set(setting);
};



app.enable = function(setting){
return this.set(setting, true);
};



app.disable = function(setting){
return this.set(setting, false);
};



app.redirect = function(key, url){
this.redirects[key] = url;
return this;
};



app.configure = function(env, fn){
var envs = 'all'
, args = toArray(arguments);
fn = args.pop();
if (args.length) envs = args;
if ('all' == envs || ~envs.indexOf(this.settings.env)) fn.call(this);
return this;
};



methods.forEach(function(method){
app[method] = function(path){
if ('get' == method && 1 == arguments.length) return this.set(path);
var args = [method].concat(toArray(arguments));
return this._router._route.apply(this._router, args);
}
});



app.all = function(path){
var args = arguments;
methods.forEach(function(method){
if ('all' == method) return;
app[method].apply(this, args);
}, this);
return this;
};



app.del = app.delete;



app.render = function(name, options, fn){
var self = this
, opts = {}
, cache = this.cache
, engines = this.engines
, view;


if ('function' == typeof options) {
fn = options, options = {};
}


utils.merge(opts, this.locals);


if (options.locals) {
utils.merge(opts, options.locals);
delete opts.locals;
}


utils.merge(opts, options);


opts.cache = null == opts.cache
? this.enabled('view cache')
: opts.cache;


if (opts.cache) view = cache[name];


if (!view) {
view = new View(name, {
defaultEngine: this.get('view engine')
, root: this.get('views') || process.cwd() + '/views'
, engines: engines
});


if (opts.cache) cache[name] = view;
}


try {
view.render(opts, fn);
} catch (err) {
fn(err);
}
};
