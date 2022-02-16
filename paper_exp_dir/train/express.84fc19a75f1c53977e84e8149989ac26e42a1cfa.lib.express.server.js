




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



Server.prototype.set = function(setting, val){
if (val === undefined) {
return this.settings[setting];
} else {
this.settings[setting] = val;
return this;
}
};



Server.prototype.enable = function(setting){
return this.set(setting, true);
};



Server.prototype.disable = function(setting){
return this.set(setting, false);
};



Server.prototype.configure = function(env, fn){
if (typeof env === 'function') fn = env, env = 'any';
(this.config[env] = this.config[env] || []).push(fn);
return this;
};



(function(method){
Server.prototype[method] = function(path, fn){
this.routes[method](path, fn);
return this;
};
return arguments.callee;
})('get')('post')('put')('del');
