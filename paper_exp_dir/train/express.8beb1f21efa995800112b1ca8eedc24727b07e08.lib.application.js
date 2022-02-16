

var connect = require('connect')
, Router = require('./router')
, methods = require('methods')
, middleware = require('./middleware')
, debug = require('debug')('express:application')
, locals = require('./utils').locals
, View = require('./view')
, utils = connect.utils
, path = require('path')
, http = require('http')
, join = path.join;



var app = exports = module.exports = {};



app.init = function(){
this.cache = {};
this.settings = {};
this.engines = {};
this.viewCallbacks = [];
this.defaultConfiguration();
};



app.defaultConfiguration = function(){

this.enable('x-powered-by');
this.set('env', process.env.NODE_ENV || 'development');
debug('booting in %s mode', this.get('env'));


this.use(connect.query());
this.use(middleware.init(this));


this.on('mount', function(parent){
this.request.__proto__ = parent.request;
this.response.__proto__ = parent.response;
this.engines.__proto__ = parent.engines;
});


this._router = new Router(this);
this.routes = this._router.map;
this.__defineGetter__('router', function(){
this._usedRouter = true;
this._router.caseSensitive = this.enabled('case sensitive routing');
this._router.strict = this.enabled('strict routing');
return this._router.middleware;
});


this.locals = locals(this);


this.locals.settings = this.settings;


this.set('views', process.cwd() + '/views');
this.set('jsonp callback name', 'callback');

this.configure('development', function(){
this.set('json spaces', 2);
});

this.configure('production', function(){
this.enable('view cache');
});
};



app.use = function(route, fn){
var app;


if ('string' != typeof route) fn = route, route = '/';


if (fn.handle && fn.set) app = fn;


if (app) {
app.route = route;
fn = function(req, res, next) {
var orig = req.app;
app.handle(req, res, function(err){
req.app = res.app = orig;
req.__proto__ = orig.request;
res.__proto__ = orig.response;
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
if ('function' != typeof fn) throw new Error('callback function required');
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



app.set = function(setting, val){
if (1 == arguments.length) {
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



methods.forEach(function(method){
app[method] = function(path){
if ('get' == method && 1 == arguments.length) return this.set(path);


if (!this._usedRouter) this.use(this.router);


this._router[method].apply(this._router, arguments);
return this;
};
});



app.all = function(path){
var args = arguments;
methods.forEach(function(method){
app[method].apply(this, args);
}, this);
return this;
};



app.del = app.delete;



app.render = function(name, options, fn){
var opts = {}
, cache = this.cache
, engines = this.engines
, view;


if ('function' == typeof options) {
fn = options, options = {};
}


utils.merge(opts, this.locals);


if (options._locals) utils.merge(opts, options._locals);


utils.merge(opts, options);


opts.cache = null == opts.cache
? this.enabled('view cache')
: opts.cache;


if (opts.cache) view = cache[name];


if (!view) {
view = new View(name, {
defaultEngine: this.get('view engine'),
root: this.get('views'),
engines: engines
});

if (!view.path) {
var err = new Error('Failed to lookup view "' + name + '"');
err.view = view;
return fn(err);
}


if (opts.cache) cache[name] = view;
}


try {
view.render(opts, fn);
} catch (err) {
fn(err);
}
};



app.listen = function(){
var server = http.createServer(this);
return server.listen.apply(server, arguments);
};
