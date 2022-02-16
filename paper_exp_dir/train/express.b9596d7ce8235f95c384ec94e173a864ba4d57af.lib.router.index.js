




var utils = require('../utils')
, parse = require('url').parse
, _methods = require('./methods')
, Route = require('./route');



exports = module.exports = router;



exports.methods = _methods;



function router(fn){
var self = this
, methods = {}
, routes = {}
, params = {};

if (!fn) throw new Error('router provider requires a callback function');


_methods.forEach(function(method){
methods[method] = generateMethodFunction(method.toUpperCase());
});


methods.del = methods.delete;


methods.all = function(){
var args = arguments;
_methods.forEach(function(name){
methods[name].apply(this, args);
});
return self;
};


methods.param = function(name, fn){
params[name] = fn;
};

fn.call(this, methods);

function generateMethodFunction(name) {
var localRoutes = routes[name] = routes[name] || [];
return function(path, fn){
var keys = []
, middleware = [];


if (arguments.length > 2) {
middleware = Array.prototype.slice.call(arguments, 1, arguments.length);
fn = middleware.pop();
middleware = utils.flatten(middleware);
}

fn.middleware = middleware;

if (!path) throw new Error(name + ' route requires a path');
if (!fn) throw new Error(name + ' route ' + path + ' requires a callback');

var route = new Route(name, path, fn);
localRoutes.push(route);
return self;
};
}

function router(req, res, next){
var route
, self = this;

(function pass(i){
if (route = match(req, routes, i)) {
var i = 0
, keys = route.keys;

req.params = route.params;


(function param(err) {
try {
var key = keys[i++]
, val = req.params[key]
, fn = params[key];

if ('route' == err) {
pass(req._route_index + 1);

} else if (err) {
next(err);

} else if (fn) {

if (1 == fn.length) {
req.params[key] = fn(val);
param();

} else {
fn(req, res, param, val);
}

} else if (!key) {

i = 0;
(function nextMiddleware(err){
var fn = route.callback.middleware[i++];
if ('route' == err) {
pass(req._route_index + 1);
} else if (err) {
next(err);
} else if (fn) {
fn(req, res, nextMiddleware);
} else {
route.callback.call(self, req, res, function(err){
if (err) {
next(err);
} else {
pass(req._route_index + 1);
}
});
}
})();

} else {
param();
}
} catch (err) {
next(err);
}
})();
} else if ('OPTIONS' == req.method) {
options(req, res, routes);
} else {
next();
}
})();
};

router.remove = function(path, method, ret){
var ret = ret || []
, route;


if (method) {
method = method.toUpperCase();
if (routes[method]) {
for (var i = 0; i < routes[method].length; ++i) {
route = routes[method][i];
