




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
