




var sys = require('sys'),
connect = require('connect'),
router = require('connect/middleware/router');



var Server = exports = module.exports = function Server(middleware){
var self = this;
this.config = {};
this.settings = {};
connect.Server.call(this, middleware || []);
this.use('/', router(function(app){
self.routes = app;
}));
};



sys.inherits(Server, connect.Server);



Server.prototype.listen = function(port){
var env = process.env.EXPRESS_ENV || process.connectEnv.name;
this.runConfig('any', env);
connect.Server.prototype.listen.call(this, port);
};


