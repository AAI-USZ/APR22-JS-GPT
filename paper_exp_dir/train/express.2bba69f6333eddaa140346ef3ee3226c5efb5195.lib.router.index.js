

var Route = require('./route')
, utils = require('../utils')
, debug = require('debug')('express:router')
, parse = require('connect').utils.parseUrl
, methods = require('methods');



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
, key
, ret;


function nextRoute(err) {
pass(req._route_index + 1, err);
}


req.route = route = self.matchRequest(req, i);


if (!route) return next(err);
debug('matched %s %s', route.method, route.path);



req.params = route.params;
keys = route.keys;
i = 0;


function param(err) {
