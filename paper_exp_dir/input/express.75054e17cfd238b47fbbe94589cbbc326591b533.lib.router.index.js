




var Route = require('./route')
, Collection = require('./collection')
, utils = require('../utils')
, parse = require('url').parse
, toArray = utils.toArray;



exports = module.exports = Router;



var methods = exports.methods = require('./methods');



function Router(app) {
var self = this;
this.app = app;
this.routes = {};
this.params = {};
this._params = [];

this.middleware = function(req, res, next){
self._dispatch(req, res, next);
};
}



Router.prototype.param = function(name, fn){

if ('function' == typeof name) {
this._params.push(name);
return;
}


var params = this._params
, len = params.length
, ret;

for (var i = 0; i < len; ++i) {
if (ret = params[i](name, fn)) {
fn = ret;
}
}



if ('function' != typeof fn) {
throw new Error('invalid param() call for ' + name + ', got ' + fn);
}

(this.params[name] = this.params[name] || []).push(fn);
return this;
};



Router.prototype.all = function(){
return this.find(function(){
return true;
});
};



Router.prototype.remove = function(route){
var routes = this.routes[route.method]
, len = routes.length;

for (var i = 0; i < len; ++i) {
if (route == routes[i]) {
routes.splice(i, 1);
return true;
}
}
};



Router.prototype.lookup = function(method, path){
return this.find(function(route){
return path == route.path
&& (route.method == method
|| method == 'all');
});
};



Router.prototype.match = function(method, url){
return this.find(function(route){
return route.match(url)
&& (route.method == method
|| method == 'all');
});
};



Router.prototype.find = function(fn){
var len = methods.length
, ret = new Collection(this)
, method
, routes
, route;

for (var i = 0; i < len; ++i) {
method = methods[i];
routes = this.routes[method];
if (!routes) continue;
for (var j = 0, jlen = routes.length; j < jlen; ++j) {
route = routes[j];
if (fn(route)) ret.push(route);
}
}

return ret;
};



Router.prototype._dispatch = function(req, res, next){
var params = this.params

