




var sys = require('sys'),
url = require('url'),
view = require('./view'),
connect = require('connect'),
queryString = require('querystring'),
router = require('connect/middleware/router');



var Server = exports = module.exports = function Server(middleware){
var self = this;
this.config = {};
this.settings = {};
this.redirects = {};
connect.Server.call(this, middleware || []);


this.use(function(req, res, next){
req.params = req.params || {};
req.params.get = {};
res.headers = {};
req.app = res.app = self;
req.res = res;
res.req = req;

if (req.url.indexOf('?') > 0) {

var query = url.parse(req.url).query;
req.params.get = queryString.parse(query);
}
next();
});


this.router = router(function(app){ self.routes = app; });
};



sys.inherits(Server, connect.Server);



Server.prototype.listen = function(port, host){
this.set('env', process.env.EXPRESS_ENV || process.connectEnv.name);
this.runConfig('any', this.set('env'));


if (this.set('reload views')) {
view.watcher.call(this, this.set('reload views'));
}

connect.Server.prototype.listen.call(this, port, host);
};



Server.prototype.runConfig = function(){
for (var i = 0, len = arguments.length; i < len; ++i) {
var env = arguments[i];
if (env in this.config) {
var config = this.config[env];
config.forEach(function(fn){
fn.call(this);
}, this);
}
}
return this;
};



Server.prototype.helpers = function(obj){
var keys = Object.keys(obj);
for (var i = 0, len = keys.length; i < len; ++i) {
var key = keys[i],
val = obj[key];
if (typeof val === 'function') {
view.dynamicHelpers[key] = val;
} else {
view.helpers[key] = val;
}
