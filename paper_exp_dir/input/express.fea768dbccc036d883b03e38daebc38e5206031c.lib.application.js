

var finalhandler = require('finalhandler');
var flatten = require('./utils').flatten;
var Router = require('./router');
var methods = require('methods');
var middleware = require('./middleware/init');
var query = require('./middleware/query');
var debug = require('debug')('express:application');
var View = require('./view');
var http = require('http');
var compileETag = require('./utils').compileETag;
var compileQueryParser = require('./utils').compileQueryParser;
var compileTrust = require('./utils').compileTrust;
var deprecate = require('depd')('express');
var merge = require('utils-merge');
var resolve = require('path').resolve;
var slice = Array.prototype.slice;



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
this.set('query parser', 'extended');
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

this._router.use(query(this.get('query parser fn')));
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



app.use = function use(fn) {
var offset = 0;
var path = '/';



if (typeof fn !== 'function') {
var arg = fn;

while (Array.isArray(arg) && arg.length !== 0) {
arg = arg[0];
}


if (typeof arg !== 'function') {
offset = 1;
path = fn;
}
}

var fns = flatten(slice.call(arguments, offset));

if (fns.length === 0) {
throw new TypeError('app.use() requires middleware functions');
}


this.lazyrouter();
var router = this._router;

fns.forEach(function (fn) {

if (!fn || !fn.handle || !fn.set) {
return router.use(path, fn);
}

debug('.use app under %s', path);
fn.mountpath = path;
fn.parent = this;


router.use(path, function mounted_app(req, res, next) {
var orig = req.app;
fn.handle(req, res, function (err) {
req.__proto__ = orig.request;
res.__proto__ = orig.response;
next(err);
});
});


fn.emit('mount', this);
}, this);

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
this.lazyrouter();

if (Array.isArray(name)) {
name.forEach(function(key) {
this.param(key, fn);
}, this);
return this;
}

this._router.param(name, fn);
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
case 'query parser':
debug('compile query parser %s', val);
this.set('query parser fn', compileQueryParser(val));
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
route[method].apply(route, slice.call(arguments, 1));
return this;
};
});



app.all = function(path){
this.lazyrouter();

var route = this._router.route(path);
var args = slice.call(arguments, 1);
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


merge(opts, this.locals);


if (options._locals) {
merge(opts, options._locals);
}


merge(opts, options);


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
var dirs = Array.isArray(view.root) && view.root.length > 1
? 'directories "' + view.root.slice(0, -1).join('", "') + '" or "' + view.root[view.root.length - 1] + '"'
: 'directory "' + view.root + '"'
var err = new Error('Failed to lookup view "' + name + '" in views ' + dirs);
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
