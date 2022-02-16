

var Route = require('./route')
, utils = require('../utils')
, methods = require('methods')
, debug = require('debug')('express:router')
, parse = require('connect').utils.parseUrl;



exports = module.exports = Router;



function Router(options) {
options = options || {};
var self = this;
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



Router.prototype._dispatch = function(req, res, next){
var params = this.params
, self = this;

debug('dispatching %s %s (%s)', req.method, req.url, req.originalUrl);


(function pass(i, err){
var paramCallbacks
, paramIndex = 0
, paramVal
, route
, keys
, key;


function nextRoute(err) {
pass(req._route_index + 1, err);
}


req.route = route = self.matchRequest(req, i);


if (!route && 'OPTIONS' == req.method) return self._options(req, res);


if (!route) return next(err);
debug('matched %s %s', route.method, route.path);



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
if (fn.length < 4) return fn(req, res, callbacks);
callbacks();
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
var path = parse(req).pathname
, body = this._optionsFor(path).join(',');
res.set('Allow', body).send(body);
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



Router.prototype.matchRequest = function(req, i, head){
var method = req.method.toLowerCase()
, url = parse(req)
, path = url.pathname
, routes = this.map
, i = i || 0
, route;


if (!head && 'head' == method) {
route = this.matchRequest(req, i, true);
if (route) return route;
method = 'get';
}


if (routes = routes[method]) {


for (var len = routes.length; i < len; ++i) {
route = routes[i];
if (route.match(path)) {
req._route_index = i;
return route;
}
}
}
};



Router.prototype.match = function(method, url, i, head){
var req = { method: method, url: url };
return  this.matchRequest(req, i, head);
};



Router.prototype.route = function(method, path, callbacks){
var method = method.toLowerCase()
, callbacks = utils.flatten([].slice.call(arguments, 2));


if (!path) throw new Error('Router#' + method + '() requires a path');


callbacks.forEach(function(fn){
if ('function' == typeof fn) return;
var type = {}.toString.call(fn);
var msg = '.' + method + '() requires callback functions but got a ' + type;
throw new Error(msg);
});


debug('defined %s %s', method, path);
var route = new Route(method, path, callbacks, {
sensitive: this.caseSensitive,
strict: this.strict
});


(this.map[method] = this.map[method] || []).push(route);
return this;
};

methods.forEach(function(method){
Router.prototype[method] = function(path){
var args = [method].concat([].slice.call(arguments));
this.route.apply(this, args);
return this;
};
});
