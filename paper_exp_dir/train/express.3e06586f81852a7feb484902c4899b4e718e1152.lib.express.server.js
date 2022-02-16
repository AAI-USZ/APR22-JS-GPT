




var url = require('url')
, view = require('./view')
, connect = require('connect')
, utils = connect.utils
, queryString = require('querystring')
, router = require('connect/middleware/router');



var Server = exports = module.exports = function Server(middleware){
var self = this;
this.config = {};
this.settings = {};
this.redirects = {};
this.isCallbacks = {};
this.viewHelpers = {};
this.dynamicViewHelpers = {};
this.errorHandlers = [];
connect.Server.call(this, middleware || []);


this.set('home', '/');


this.showVersion = false;


this.set('env', process.env.NODE_ENV || 'development');


this.use(function(req, res, next){
req.query = {};
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



Server.prototype.helpers = function(obj){
utils.merge(this.viewHelpers, obj);
return this;
};



Server.prototype.dynamicHelpers = function(obj){
utils.merge(this.dynamicViewHelpers, obj);
return this;
};



Server.prototype.param = function(name, fn){
if (':' == name[0]) name = name.substr(1);
this.routes.param(name, fn);
return this;
};



Server.prototype.error = function(fn){
this.errorHandlers.push(fn);
return this;
};



Server.prototype.is = function(type, fn){
if (!fn) return this.isCallbacks[type];
