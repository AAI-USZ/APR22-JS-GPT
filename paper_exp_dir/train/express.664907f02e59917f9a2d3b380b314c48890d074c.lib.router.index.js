




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
, self = this
, error;


(function pass(i){
var paramCallbacks
, paramIndex = 0
, paramVal
, route
, keys
, key
, ret;


function nextRoute() {
pass(req._route_index + 1);
}


req.route = route = self._match(req, i);


if (!route && 'OPTIONS' == req.method) return self._options(req, res);


if (!route) return next(error);



req.params = route.params;
keys = route.keys;
i = 0;


function param(err) {
key = keys[i++];
paramVal = key && req.params[key.name];
paramCallbacks = key && params[key.name];

try {
if ('route' == err) {
nextRoute();
} else if (err) {
next(err);
} else if (paramCallbacks && undefined !== paramVal) {
paramCallback();
} else if (key) {
param();
} else {
i = 0;
middleware();
}
} catch (err) {
next(err);
}
};

param();


function paramCallback(err) {
var fn = paramCallbacks[paramIndex++];
if (err || !fn) return param(err);
fn(req, res, paramCallback, paramVal, key.name);
}


function middleware(err) {
var fn = route.middleware[i++];
if ('route' == err) {
nextRoute();
} else if (err) {
next(err);
} else if (fn) {
fn(req, res, middleware);
} else {
done();
}
};


function done() {
var fn = route.callback;

try {
if (error) {
if (fn.length < 4) return nextRoute();
fn(error, req, res, function(err){
error = err;
nextRoute();
});
} else {
fn(req, res, function(err){
error = err;
nextRoute();
});
}
} catch (err) {
error = err;
nextRoute();
}
