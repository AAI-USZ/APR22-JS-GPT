




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



app.use = function(route, fn){
var app, home, handle;


if ('string' != typeof route) fn = route, route = '/';


if (fn.handle && fn.set) app = fn;


if (app) {
app.route = route;
fn = function(req, res, next) {
var orig = req.app;
app.handle(req, res, function(err){
req.app = res.app = orig;
next(err);
});
};
}

connect.proto.use.call(this, route, fn);


if (app) {
app.parent = this;
app.emit('mount', this);
}

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



app.path = function(){
return this.parent
? this.parent.path() + this.route
: '';
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



app.configure = function(env, fn){
var envs = 'all'
, args = [].slice.call(arguments);
fn = args.pop();
if (args.length) envs = args;
if ('all' == envs || ~envs.indexOf(this.settings.env)) fn.call(this);
return this;
};



app.listen = function(){
var server = http.createServer(this);
return server.listen.apply(server, arguments);
};



methods.forEach(function(method){
app[method] = function(path){
if ('get' == method && 1 == arguments.length) return this.set(path);
var args = [method].concat([].slice.call(arguments));
if (!this._usedRouter) this.use(this.router);
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
