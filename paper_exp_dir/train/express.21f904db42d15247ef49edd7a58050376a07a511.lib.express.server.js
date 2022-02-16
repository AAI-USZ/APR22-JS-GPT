




var sys = require('sys'),
connect = require('connect'),
router = require('connect/middleware/router');



var Server = exports = module.exports = function Server(middleware){
var self = this;
this.config = {};
this.settings = {};
connect.Server.call(this, middleware || []);


this.use('/', function(req, res, next){
req.app = res.app = self;
next();
});


this.use('/', router(function(app){
self.routes = app;
}));
