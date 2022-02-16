




var url = require('url')
, view = require('./view')
, connect = require('connect')
, utils = connect.utils
, queryString = require('querystring')
, router = require('connect').router
, methods = router.methods.concat(['del', 'all']);



var Server = exports = module.exports = function Server(middleware){
var self = this;
this.config = {};
this.settings = {};
this.redirects = {};
this.isCallbacks = {};
this.viewHelpers = {};
this.dynamicViewHelpers = {};
this.errorHandlers = [];
connect.Server.call(this, []);


this.set('home', '/');


this.set('env', process.env.NODE_ENV || 'development');


this.use(function(req, res, next){
req.query = req.query || {};
res.headers = { 'X-Powered-By': 'Express' };
req.app = res.app = self;
req.res = res;
res.req = req;
req.next = next;

if (req.url.indexOf('?') > 0) {
var query = url.parse(req.url).query;
req.query = exports.parseQueryString(query);
}
next();
});


if (middleware) {
middleware.forEach(function(fn){
self.use(fn);
});
}


var fn = router(function(app){ self.routes = app; });
this.__defineGetter__('router', function(){
this.__usedRouter = true;
return fn;
});


this.configure('production', function(){
this.enable('cache views');
});
};



Server.prototype.__proto__ = connect.Server.prototype;



exports.parseQueryString = queryString.parse;



Server.prototype.listen = function(){
this.registerErrorHandlers();
connect.Server.prototype.listen.apply(this, arguments);
};



Server.prototype.listenFD = function(){
this.registerErrorHandlers();
connect.Server.prototype.listenFD.apply(this, arguments);
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
if (typeof route !== 'string') {
middleware = route, route = '/';
}

connect.Server.prototype.use.call(this, route, middleware);


if (middleware instanceof Server) {

var app = middleware
, home = app.set('home');
if (home === '/') home = '';
app.set('home', (app.route || '') + home);
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
utils.merge(this.viewHelpers, obj);
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
if (typeof env === 'function') {
fn = env, env = 'all';
}
if ('all' == env || env == this.settings.env) {
fn.call(this);
}
return this;
};



function generateMethod(method){
Server.prototype[method] = function(path, fn){
var self = this;


if (!this.__usedRouter) {
this.use(this.router);
}


if (arguments.length > 2) {
var args = Array.prototype.slice.call(arguments, 1);
fn = args.pop();
(function stack(middleware){
middleware.forEach(function(fn){
if (Array.isArray(fn)) {
stack(fn);
} else {
self[method](path, fn);
}
});
})(args);
}


this.routes[method](path, fn);
return this;
};
return arguments.callee;
}

methods.forEach(generateMethod);



Server.prototype.del = Server.prototype.delete;
