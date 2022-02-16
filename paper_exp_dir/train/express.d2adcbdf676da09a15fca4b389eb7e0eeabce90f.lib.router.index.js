




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

fn.middleware = middleware;

if (!path) throw new Error(name + ' route requires a path');
if (!fn) throw new Error(name + ' route ' + path + ' requires a callback');

var options = { sensitive: app.enabled('case sensitive routes') };
var route = new Route(name, path, fn, options);
localRoutes.push(route);
return self;
};
}

function router(req, res, next){
var route
