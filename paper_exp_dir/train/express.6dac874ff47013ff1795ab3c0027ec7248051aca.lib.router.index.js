




var Route = require('./route')
, Collection = require('./collection')
, utils = require('../utils')
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


req.route = route = self._match(req, i);


if (!route && 'OPTIONS' == req.method) return self._options(req, res);


if (!route) return next(err);



req.params = route.params;
keys = route.keys;
i = 0;


function param(err) {
paramIndex = 0;
key = keys[i++];
paramVal = key && req.params[key.name];
paramCallbacks = key && params[key.name];

try {
if ('route' == err) {
nextRoute();
} else if (err) {
i = 0;
callbacks(err);
} else if (paramCallbacks && undefined !== paramVal) {
paramCallback();
} else if (key) {
param();
} else {
i = 0;
callbacks();
}
} catch (err) {
param(err);
}
};

param(err);


function paramCallback(err) {
var fn = paramCallbacks[paramIndex++];
if (err || !fn) return param(err);
fn(req, res, paramCallback, paramVal, key.name);
}


function callbacks(err) {
var fn = route.callbacks[i++];
try {
if ('route' == err) {
nextRoute();
} else if (err && fn) {
if (fn.length < 4) return callbacks(err);
fn(err, req, res, callbacks);
} else if (fn) {
fn(req, res, callbacks);
} else {
nextRoute(err);
}
} catch (err) {
callbacks(err);
}
}
})(0);
};



Router.prototype._options = function(req, res){
var path = parse(req.url).pathname
, body = this._optionsFor(path).join(',');
res.header('Allow', body).send(body);
};



Router.prototype._optionsFor = function(path){
var self = this;
return methods.filter(function(method){
var routes = self.map[method];
if (!routes || 'options' == method) return;
for (var i = 0, len = routes.length; i < len; ++i) {
if (routes[i].match(path)) return true;
}
}).map(function(method){
return method.toUpperCase();
});
};



Router.prototype._match = function(req, i, head){
var method = req.method.toLowerCase()
, url = parse(req.url)
, path = url.pathname
, routes = this.map
, captures
, route
, keys;



if (!head && 'head' == method) {

route = this._match(req, i, true);
if (route) return route;



method = 'get';
}


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



Router.prototype.route = function(method, path, callbacks){
var app = this.app
, method = method.toLowerCase()
, callbacks = utils.flatten([].slice.call(arguments, 2));


if (!path) throw new Error('Router#' + method + '() requires a path');


var route = new Route(method, path, callbacks, {
sensitive: this.caseSensitive
, strict: this.strict
});
