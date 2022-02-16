

'use strict';



var Route = require('./route');
var Layer = require('./layer');
var methods = require('methods');
var mixin = require('utils-merge');
var debug = require('debug')('express:router');
var deprecate = require('depd')('express');
var flatten = require('array-flatten');
var parseUrl = require('parseurl');
var setPrototypeOf = require('setprototypeof')



var objectRegExp = /^\[object (\S+)\]$/;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;



var proto = module.exports = function(options) {
var opts = options || {};

function router(req, res, next) {
router.handle(req, res, next);
}


setPrototypeOf(router, proto)

router.params = {};
router._params = [];
router.caseSensitive = opts.caseSensitive;
router.mergeParams = opts.mergeParams;
router.strict = opts.strict;
router.stack = [];

return router;
};



proto.param = function param(name, fn) {

if (typeof name === 'function') {
deprecate('router.param(fn): Refactor to use path params');
this._params.push(name);
return;
}


var params = this._params;
var len = params.length;
var ret;

if (name[0] === ':') {
deprecate('router.param(' + JSON.stringify(name) + ', fn): Use router.param(' + JSON.stringify(name.substr(1)) + ', fn) instead');
name = name.substr(1);
}

for (var i = 0; i < len; ++i) {
if (ret = params[i](name, fn)) {
fn = ret;
}
}



if ('function' !== typeof fn) {
throw new Error('invalid param() call for ' + name + ', got ' + fn);
}

(this.params[name] = this.params[name] || []).push(fn);
return this;
};



proto.handle = function handle(req, res, out) {
var self = this;

debug('dispatching %s %s', req.method, req.url);

var idx = 0;
var protohost = getProtohost(req.url) || ''
var removed = '';
var slashAdded = false;
var paramcalled = {};



var options = [];


var stack = self.stack;


var parentParams = req.params;
var parentUrl = req.baseUrl || '';
var done = restore(out, req, 'baseUrl', 'next', 'params');


req.next = next;


if (req.method === 'OPTIONS') {
done = wrap(done, function(old, err) {
if (err || options.length === 0) return old(err);
sendOptionsResponse(res, options, old);
});
}


req.baseUrl = parentUrl;
req.originalUrl = req.originalUrl || req.url;

next();

function next(err) {
var layerError = err === 'route'
? null
: err;


if (slashAdded) {
req.url = req.url.substr(1);
slashAdded = false;
}


if (removed.length !== 0) {
req.baseUrl = parentUrl;
req.url = protohost + removed + req.url.substr(protohost.length);
removed = '';
}


if (idx >= stack.length) {
setImmediate(done, layerError);
return;
}


var path = getPathname(req);

if (path == null) {
return done(layerError);
}


var layer;
var match;
var route;

while (match !== true && idx < stack.length) {
layer = stack[idx++];
match = matchLayer(layer, path);
route = layer.route;

if (typeof match !== 'boolean') {

layerError = layerError || match;
}

if (match !== true) {
continue;
}

if (!route) {

continue;
}

if (layerError) {

match = false;
continue;
}

var method = req.method;
var has_method = route._handles_method(method);


if (!has_method && method === 'OPTIONS') {
appendMethods(options, route._options());
}


if (!has_method && method !== 'HEAD') {
match = false;
continue;
}
}


if (match !== true) {
return done(layerError);
}


if (route) {
req.route = route;
}


req.params = self.mergeParams
? mergeParams(layer.params, parentParams)
: layer.params;
var layerPath = layer.path;


self.process_params(layer, paramcalled, req, res, function (err) {
if (err) {
return next(layerError || err);
}

if (route) {
return layer.handle_request(req, res, next);
}

trim_prefix(layer, layerError, layerPath, path);
});
}

function trim_prefix(layer, layerError, layerPath, path) {
if (layerPath.length !== 0) {

var c = path[layerPath.length]
if (c && c !== '/' && c !== '.') return next(layerError)



debug('trim prefix (%s) from url %s', layerPath, req.url);
removed = layerPath;
req.url = protohost + req.url.substr(protohost.length + removed.length);


