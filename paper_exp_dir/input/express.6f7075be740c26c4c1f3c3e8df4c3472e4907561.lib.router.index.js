




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

this.params[name] = fn;
return this;
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
, self = this;


(function pass(i){
var route
, keys
, ret;


function nextRoute() {
pass(req._route_index + 1);
}


req.route = route = self._match(req, i);


if (!route && 'OPTIONS' == req.method) return self._options(req, res);


if (!route) return next();



req.params = route.params;
keys = route.keys;
i = 0;

(function param(err) {
var key = keys[i++]
, val = key && req.params[key.name]
, fn = key && params[key.name]
, ret;

try {
if ('route' == err) {
nextRoute();
} else if (err) {
next(err);
} else if (fn && undefined !== val) {
fn(req, res, param, val);
} else if (key) {
param();
} else {
i = 0;
middleware();
}
} catch (err) {
next(err);
}
})();


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
route.callback.call(self, req, res, function(err){
if (err) return next(err);
pass(req._route_index + 1);
});
}
})(0);
};



Router.prototype._options = function(req, res){
var path = parse(req.url).pathname
, body = this._optionsFor(path).join(',');
res.send(body, { Allow: body });
};



Router.prototype._optionsFor = function(path){
var self = this;
return methods.filter(function(method){
var routes = self.routes[method];
if (!routes || 'options' == method) return;
for (var i = 0, len = routes.length; i < len; ++i) {
if (routes[i].match(path)) return true;
}
}).map(function(method){
return method.toUpperCase();
});
};



Router.prototype._match = function(req, i){
var method = req.method.toLowerCase()
, url = parse(req.url)
, path = url.pathname
, routes = this.routes
, captures
, route
, keys;


if ('head' == method) method = 'get';


if (routes = routes[method]) {


for (var len = routes.length; i < len; ++i) {
route = routes[i];
if (captures = route.match(path)) {
keys = route.keys;
route.params = [];


for (var j = 1, jlen = captures.length; j < jlen; ++j) {
var key = keys[j-1]
, val = 'string' == typeof captures[j]
? decodeURIComponent(captures[j])
: captures[j];
if (key) {
route.params[key.name] = val;
} else {
route.params.push(val);
}
}


req._route_index = i;
return route;
}
}
}
};



Router.prototype._route = function(method, path, fn){
var app = this.app
, middleware = [];


if (arguments.length > 3) {
middleware = toArray(arguments, 2);
fn = middleware.pop();
middleware = utils.flatten(middleware);
}


if (!path) throw new Error(method + 'route requires a path');
if (!fn) throw new Error(method + ' route ' + path + ' requires a callback');


var route = new Route(method, path, fn, {
sensitive: app.enabled('case sensitive routes')
