




var url = require('url'),
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
this.errorHandlers = [];
connect.Server.call(this, middleware || []);


this.set('home', '/');


if (process.env.EXPRESS_ENV) {
process.env.NODE_ENV = process.env.EXPRESS_ENV;
console.warn('\x1b[33mWarning\x1b[0m: EXPRESS_ENV is deprecated, use NODE_ENV.');
}


this.set('env', process.env.NODE_ENV);


this.use(function(req, res, next){
req.query = {};
res.headers = {};
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
};



Server.prototype.__proto__ = connect.Server.prototype;



exports.parseQueryString = queryString.parse;



Server.prototype.listen = function(){
this.registerErrorHandlers();
connect.Server.prototype.listen.apply(this, arguments);
};

