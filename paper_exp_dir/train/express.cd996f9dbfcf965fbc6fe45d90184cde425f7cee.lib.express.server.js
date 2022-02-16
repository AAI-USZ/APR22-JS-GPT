




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
