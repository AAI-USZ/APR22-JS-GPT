



var Route = require('./route')
, Collection = require('./collection')
, utils = require('../utils')
, debug = require('debug')('express:routes')
, parse = require('url').parse;



exports = module.exports = Router;



var methods = exports.methods = require('./methods');



function Router(options) {
options = options || {};
var self = this;
this.routes = new Collection;
this.map = {};
this.params = {};
this._params = [];
this.caseSensitive = options.caseSensitive;
this.strict = options.strict;

this.middleware = function router(req, res, next){
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
var routes = this.map[route.method]
, len = routes.length;


var i = this.routes.indexOf(route);
this.routes.splice(i, 1);


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




















Router.prototype.find = function(fn){
var len = methods.length
, ret = new Collection(this)
, method
, routes
, route;

for (var i = 0; i < len; ++i) {
method = methods[i];
routes = this.map[method];
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
, self = this;

debug('dispatching %s %s', req.method, req.url);


(function pass(i, err){
var paramCallbacks
, paramIndex = 0
, paramVal
, route
, keys
, key
, ret;


function nextRoute(err) {
pass(req._route_index + 1, err);
}


req.route = route = self.match(req, i);

