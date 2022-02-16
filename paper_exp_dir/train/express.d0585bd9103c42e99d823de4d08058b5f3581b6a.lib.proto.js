




var connect = require('connect')
, Router = require('./router')
, view = require('./view')
, toArray = require('./utils').toArray
, methods = Router.methods.concat('del', 'all')
, res = require('./response')
, union = require('./utils').union
, url = require('url')
, utils = connect.utils
, path = require('path')
, extname = path.extname
, join = path.join
, fs = require('fs')
, qs = require('qs');



var app = exports = module.exports = {};



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



app.register = function(){
view.register.apply(this, arguments);
return this;
};



app.locals = function(obj){
utils.merge(this._locals, obj);
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
this.routes.param(name);

} else {
if (':' == name[0]) name = name.substr(1);
fns.forEach(function(fn){
self.routes.param(name, fn);
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
if (1 == arguments.length) return this.routes.lookup(method, path);
var args = [method].concat(toArray(arguments));
if (!this.__usedRouter) this.use(this.router);
return this.routes._route.apply(this.routes, args);
}
});



app.all = function(path){
var args = arguments;
if (1 == args.length) return this.routes.lookup('all', path);
methods.forEach(function(method){
if ('all' == method) return;
app[method].apply(this, args);
}, this);
return this;
};



app.del = app.delete;



app.render = function(view, opts, fn){
var self = this
, options = {}
, cache = this.cache
, engines = this.engines
, root = this.set('views') || process.cwd() + '/views';


if ('function' == typeof opts) {
fn = opts, opts = null;
}


union(options, this.locals);


if (opts) utils.merge(options, opts);


var ext = extname(view);
if (!ext) view += '.' + (ext = this.set('view engine'));


options.cache = this.enabled('view cache');


if (!ext) return fn(new Error('failed to find view "' + view + '"'));


try {
var engine = cache[ext] = cache[ext] || require(ext);
options.filename = join(root, view);
view = fs.readFileSync(options.filename, 'utf8');
engine.render(view, options, fn);
} catch (err) {
fn(err);
}
};
