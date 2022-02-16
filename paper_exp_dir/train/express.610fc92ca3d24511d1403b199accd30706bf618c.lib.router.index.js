




var utils = require('../utils')
, parse = require('url').parse
, _methods = require('./methods')
, Route = require('./route');



exports = module.exports = router;



exports.methods = _methods;



function router(fn, app){
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

if (!path) throw new Error(name + ' route requires a path');
if (!fn) throw new Error(name + ' route ' + path + ' requires a callback');

var options = { sensitive: app.enabled('case sensitive routes') };
var route = new Route(name, path, fn, options);
route.middleware = middleware;
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
, keys = route.keys
, ret;

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

if (fn.length < 3) {
ret = req.params[key] = fn(val);
if (invalidParam(ret)) {
pass(req._route_index + 1);
return;
}
param();

} else {
fn(req, res, param, val);
}

} else if (!key) {

i = 0;
(function nextMiddleware(err){
var fn = route.middleware[i++];
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
if (path == route.path) {
route.index = i;
routes[method].splice(i, 1);
ret.push(route);
--i;
}
}
}

} else {
_methods.forEach(function(method){
router.remove(path, method, ret);
});
}

return ret;
};

router.lookup = function(path, method, ret){
ret = ret || [];


if (method) {
method = method.toUpperCase();
if (routes[method]) {
routes[method].forEach(function(route, i){
if (path == route.path) {
route.index = i;
ret.push(route);
}
});
}

} else {
_methods.forEach(function(method){
router.lookup(path, method, ret);
});
}

return ret;
};

router.match = function(url, method, ret){
var ret = ret || []
, i = 0
, route
, req;


if (method) {
method = method.toUpperCase();
req = { url: url, method: method };
while (route = match(req, routes, i)) {
i = req._route_index + 1;
route.index = i;
ret.push(route);
}

} else {
_methods.forEach(function(method){
router.match(url, method, ret);
});
}

return ret;
};

router.routes = routes;

return router;
}



function options(req, res, routes) {
var pathname = parse(req.url).pathname
, body = optionsFor(pathname, routes).join(',');
res.send(body, { Allow: body });
}



function optionsFor(path, routes) {
return _methods.filter(function(method){
var arr = routes[method.toUpperCase()];
for (var i = 0, len = arr.length; i < len; ++i) {
if (arr[i].regexp.test(path)) return true;
}
}).map(function(method){
return method.toUpperCase();
});
}



function match(req, routes, i) {
var captures
, method = req.method
, i = i || 0;


if ('HEAD' == method) method = 'GET';


if (routes = routes[method]) {
var url = parse(req.url)
, pathname = url.pathname;


for (var len = routes.length; i < len; ++i) {
var route = routes[i]
, fn = route.callback
, path = route.regexp
, keys = route.keys;


if (captures = path.exec(pathname)) {
route.params = [];
for (var j = 1, l = captures.length; j < l; ++j) {
var key = keys[j-1],
val = 'string' == typeof captures[j]
? decodeURIComponent(captures[j])
: captures[j];
if (key) {
route.params[key] = val;
} else {
route.params.push(val);
}
}
req._route_index = i;
return route;
}
}
}
}

function invalidParam(val) {
return null == val
|| false === val
|| ('number' == typeof val && isNaN(val))
;
}
