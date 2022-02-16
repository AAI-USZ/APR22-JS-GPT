




var sys = require('sys'),
url = require('url'),
view = require('./view'),
connect = require('connect'),
utils = require('connect/utils'),
queryString = require('querystring'),
router = require('connect/middleware/router');



var Server = exports = module.exports = function Server(middleware){
var self = this;
this.config = {};
this.settings = {};
this.redirects = {};
this.viewHelpers = {};
this.dynamicViewHelpers = {};
connect.Server.call(this, middleware || []);


this.set('home', '/');


this.set('env', process.env.EXPRESS_ENV || process.connectEnv.name);


this.use(function(req, res, next){
req.params = req.params || {};
req.params.get = {};
res.headers = {};
req.app = res.app = self;
req.res = res;
res.req = req;
req.next = next;

if (req.url.indexOf('?') > 0) {

var query = url.parse(req.url).query;
req.params.get = queryString.parse(query);
}
next();
});


var fn = router(function(app){ self.routes = app; });
this.__defineGetter__('router', function(){
this.__usedRouter = true;
return fn;
});
};



sys.inherits(Server, connect.Server);



Server.prototype.listen = function(port, host){

if (this.set('reload views')) {
view.watcher.call(this, this.set('reload views'));
}
connect.Server.prototype.listen.call(this, port, host);
};



Server.prototype.use = function(route, middleware){
if (typeof route !== 'string') {
middleware = route, route = '/';
}

connect.Server.prototype.use.call(this, route, middleware);


if (middleware instanceof Server) {

var app = middleware,
home = app.set('home');
if (home === '/') home = '';
app.set('home', (app.route || '') + home);

if (app.__mounted) app.__mounted.call(app, this);
}
