

var finalhandler = require('finalhandler');
var mixin = require('utils-merge');
var Router = require('./router');
var methods = require('methods');
var middleware = require('./middleware/init');
var query = require('./middleware/query');
var debug = require('debug')('express:application');
var View = require('./view');
var http = require('http');
var compileETag = require('./utils').compileETag;
var compileTrust = require('./utils').compileTrust;
var deprecate = require('depd')('express');
var resolve = require('path').resolve;



var app = exports = module.exports = {};



app.init = function(){
this.cache = {};
this.settings = {};
this.engines = {};
this.defaultConfiguration();
};



app.defaultConfiguration = function(){

this.enable('x-powered-by');
this.set('etag', 'weak');
var env = process.env.NODE_ENV || 'development';
this.set('env', env);
this.set('subdomain offset', 2);
this.set('trust proxy', false);

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
this.set('views', resolve('views'));
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
var router = this._router;


done = done || finalhandler(req, res, {
env: this.get('env'),
onerror: logerror.bind(this)
});


if (!router) {
debug('no routes defined on app');
done();
return;
}

router.handle(req, res, done);
};



app.use = function use(path, fn) {
var mount_app;
var mount_path;


if (arguments.length <= 2) {
mount_path = typeof path === 'string'
? path
: '/';
mount_app = typeof path === 'function'
? path
: fn;
}


this.lazyrouter();
var router = this._router;


if (mount_app && mount_app.handle && mount_app.set) {
debug('.use app under %s', mount_path);
mount_app.mountpath = mount_path;
mount_app.parent = this;


router.use(mount_path, function mounted_app(req, res, next) {
var orig = req.app;
mount_app.handle(req, res, function(err) {
req.__proto__ = orig.request;
res.__proto__ = orig.response;
next(err);
});
});


mount_app.emit('mount', this);

return this;
}


router.use.apply(router, arguments);

return this;
};



app.route = function(path){
this.lazyrouter();
return this._router.route(path);
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
if (arguments.length === 1) {

return this.settings[setting];
}


this.settings[setting] = val;


switch (setting) {
case 'etag':
debug('compile etag %s', val);
this.set('etag fn', compileETag(val));
break;
case 'trust proxy':
debug('compile trust proxy %s', val);
this.set('trust proxy fn', compileTrust(val));
break;
}

return this;
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

var route = this._router.route(path);
route[method].apply(route, [].slice.call(arguments, 1));
return this;
};
});



app.all = function(path){
this.lazyrouter();

var route = this._router.route(path);
var args = [].slice.call(arguments, 1);
methods.forEach(function(method){
route[method].apply(route, args);
});

return this;
};



app.del = deprecate.function(app.delete, 'app.del: Use app.delete instead');



app.render = function(name, options, fn){
var opts = {};
var cache = this.cache;
var engines = this.engines;
var view;


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



function logerror(err){
if (this.get('env') !== 'test') console.error(err.stack || err.toString());
}
