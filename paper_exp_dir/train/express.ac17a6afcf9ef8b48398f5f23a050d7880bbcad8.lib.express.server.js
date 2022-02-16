




var sys = require('sys'),
connect = require('connect'),
router = require('connect/middleware/router');



var Server = exports = module.exports = function Server(middleware){
var self = this;
this.config = {};
this.settings = {};
connect.Server.call(this, middleware || []);


this.use('/', function(req, res, next){
res.headers = {};
req.app = res.app = self;
req.res = res;
res.req = req;
next();
});


this.use('/', router(function(app){
self.routes = app;
}));
