

var mixin = require('utils-merge')
, escapeHtml = require('escape-html')
, Router = require('./router')
, methods = require('methods')
, middleware = require('./middleware/init')
, query = require('./middleware/query')
, debug = require('debug')('express:application')
, View = require('./view')
, http = require('http');



var app = exports = module.exports = {};



app.init = function(){
this.cache = {};
this.settings = {};
this.engines = {};
this.defaultConfiguration();
};



app.defaultConfiguration = function(){

this.enable('x-powered-by');
this.enable('etag');
var env = process.env.NODE_ENV || 'development';
this.set('env', env);
this.set('subdomain offset', 2);

debug('booting in %s mode', env);


this.on('mount', function(parent){
this.request.__proto__ = parent.request;
this.response.__proto__ = parent.response;
this.engines.__proto__ = parent.engines;
this.settings.__proto__ = parent.settings;
});


this.locals = Object.create(null);


this.mountpath = '/';


this.locals.settings = this.settings;


this.set('view', View);
this.set('views', process.cwd() + '/views');
this.set('jsonp callback name', 'callback');

if (env === 'production') {
this.enable('view cache');
}

Object.defineProperty(this, 'router', {
get: function() {
throw new Error('\'app.router\' is deprecated!\nPlease see the 3.x to 4.x migration guide for details on how to update your app.');
}
});
};


app.lazyrouter = function() {
if (!this._router) {
this._router = new Router({
caseSensitive: this.enabled('case sensitive routing'),
strict: this.enabled('strict routing')
});

this._router.use(query());
this._router.use(middleware.init(this));
}
};



app.handle = function(req, res, done) {
var env = this.get('env');

this._router.handle(req, res, function(err) {
if (done) {
return done(err);
}


if (err) {

if (res.statusCode < 400) res.statusCode = 500;
debug('default %s', res.statusCode);


if (err.status) res.statusCode = err.status;


var msg = 'production' == env
? http.STATUS_CODES[res.statusCode]
: err.stack || err.toString();
msg = escapeHtml(msg);


if ('test' != env) console.error(err.stack || err.toString());
if (res.headersSent) return req.socket.destroy();
res.setHeader('Content-Type', 'text/html');
res.setHeader('Content-Length', Buffer.byteLength(msg));
if ('HEAD' == req.method) return res.end();
res.end(msg);
return;
}


debug('default 404');
res.statusCode = 404;
res.setHeader('Content-Type', 'text/html');
if ('HEAD' == req.method) return res.end();
res.end('Cannot ' + escapeHtml(req.method) + ' ' + escapeHtml(req.originalUrl) + '\n');
});
};



app.use = function(route, fn){
var mount_app;


if ('string' != typeof route) fn = route, route = '/';


if (fn.handle && fn.set) mount_app = fn;


if (mount_app) {
debug('.use app under %s', route);
mount_app.mountpath = route;
fn = function(req, res, next) {
var orig = req.app;
mount_app.handle(req, res, function(err) {
req.__proto__ = orig.request;
res.__proto__ = orig.response;
next(err);
});
};
}

this.lazyrouter();
this._router.use(route, fn);


if (mount_app) {
mount_app.parent = this;
mount_app.emit('mount', this);
}

return this;
};



app.route = function(path){
};



app.engine = function(ext, fn){
if ('function' != typeof fn) throw new Error('callback function required');
if ('.' != ext[0]) ext = '.' + ext;
this.engines[ext] = fn;
return this;
};



app.param = function(name, fn){
var self = this;
self.lazyrouter();

if (Array.isArray(name)) {
name.forEach(function(key) {
self.param(key, fn);
});
return this;
}

self._router.param(name, fn);
return this;
};



app.set = function(setting, val){
if (1 == arguments.length) {
return this.settings[setting];
} else {
this.settings[setting] = val;
return this;
}
};



app.path = function(){
return this.parent
? this.parent.path() + this.mountpath
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



methods.forEach(function(method){
app[method] = function(path){
if ('get' == method && 1 == arguments.length) return this.set(path);

this.lazyrouter();


if (Array.isArray(path)) {
console.trace('passing an array to app.VERB() is deprecated and will be removed in 4.0');
}

var route = this._router.route(path);
for (var i=1 ; i<arguments.length ; ++i) {
route[method](arguments[i]);
}
return this;
};
});



app.all = function(path){
this.lazyrouter();

var route = this._router.route(path);
var args = arguments;
methods.forEach(function(method){
for (var i=1 ; i<args.length ; ++i) {
route[method](args[i]);
}
});

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


mixin(opts, this.locals);


if (options._locals) mixin(opts, options._locals);


mixin(opts, options);


opts.cache = null == opts.cache
? this.enabled('view cache')
: opts.cache;


if (opts.cache) view = cache[name];


if (!view) {
view = new (this.get('view'))(name, {
defaultEngine: this.get('view engine'),
root: this.get('views'),
engines: engines
});

if (!view.path) {
var err = new Error('Failed to lookup view "' + name + '" in views directory "' + view.root + '"');
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
