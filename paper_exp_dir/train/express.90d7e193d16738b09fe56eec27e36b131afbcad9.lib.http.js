




var qs = require('qs')
, connect = require('connect')
, router = connect.router
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
this.settings = {};
this.redirects = {};
this.isCallbacks = {};
this.viewHelpers = {};
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


this.configure('development', function(){
this.enable('hints');
});


this.configure('production', function(){
this.enable('cache views');
});



this.on('listening', this.registerErrorHandlers.bind(this));
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
