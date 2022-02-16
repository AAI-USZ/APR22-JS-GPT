

'use strict';



var Route = require('./route');
var Layer = require('./layer');
var methods = require('methods');
var mixin = require('utils-merge');
var debug = require('debug')('express:router');
var deprecate = require('depd')('express');
var flatten = require('array-flatten');
var parseUrl = require('parseurl');



var objectRegExp = /^\[object (\S+)\]$/;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;



var proto = module.exports = function(options) {
var opts = options || {};

function router(req, res, next) {
router.handle(req, res, next);
}


router.__proto__ = proto;

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



if ('function' != typeof fn) {
throw new Error('invalid param() call for ' + name + ', got ' + fn);
}

(this.params[name] = this.params[name] || []).push(fn);
return this;
};



proto.handle = function handle(req, res, out) {
var self = this;

debug('dispatching %s %s', req.method, req.url);

var search = 1 + req.url.indexOf('?');
var pathlength = search ? search - 1 : req.url.length;
var fqdn = req.url[0] !== '/' && 1 + req.url.substr(0, pathlength).indexOf('://');
var protohost = fqdn ? req.url.substr(0, req.url.indexOf('/', 2 + fqdn)) : '';
var idx = 0;
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
var c = path[layerPath.length];
if (c && '/' !== c && '.' !== c) return next(layerError);



if (layerPath.length !== 0) {
debug('trim prefix (%s) from url %s', layerPath, req.url);
removed = layerPath;
req.url = protohost + req.url.substr(protohost.length + removed.length);


if (!fqdn && req.url[0] !== '/') {
req.url = '/' + req.url;
slashAdded = true;
}


req.baseUrl = parentUrl + (removed[removed.length - 1] === '/'
? removed.substring(0, removed.length - 1)
: removed);
}

debug('%s %s : %s', layer.name, layerPath, req.originalUrl);

if (layerError) {
layer.handle_error(layerError, req, res, next);
} else {
layer.handle_request(req, res, next);
}
}
};



proto.process_params = function process_params(layer, called, req, res, done) {
var params = this.params;


var keys = layer.keys;


if (!keys || keys.length === 0) {
return done();
}

var i = 0;
var name;
var paramIndex = 0;
var key;
var paramVal;
var paramCallbacks;
var paramCalled;



function param(err) {
if (err) {
return done(err);
}

if (i >= keys.length ) {
return done();
}

paramIndex = 0;
key = keys[i++];

if (!key) {
return done();
}

name = key.name;
paramVal = req.params[name];
paramCallbacks = params[name];
paramCalled = called[name];

if (paramVal === undefined || !paramCallbacks) {
return param();
}


if (paramCalled && (paramCalled.match === paramVal
|| (paramCalled.error && paramCalled.error !== 'route'))) {

req.params[name] = paramCalled.value;


return param(paramCalled.error);
}

called[name] = paramCalled = {
error: null,
match: paramVal,
value: paramVal
};

paramCallback();
}


function paramCallback(err) {
var fn = paramCallbacks[paramIndex++];


paramCalled.value = req.params[key.name];

if (err) {

paramCalled.error = err;
param(err);
return;
}

if (!fn) return param();

try {
fn(req, res, paramCallback, paramVal, key.name);
} catch (e) {
paramCallback(e);
}
}

param();
};



proto.use = function use(fn) {
var offset = 0;
var path = '/';



if (typeof fn !== 'function') {
var arg = fn;

while (Array.isArray(arg) && arg.length !== 0) {
arg = arg[0];
}


if (typeof arg !== 'function') {
offset = 1;
path = fn;
}
}

var callbacks = flatten(slice.call(arguments, offset));

if (callbacks.length === 0) {
throw new TypeError('Router.use() requires middleware functions');
}

for (var i = 0; i < callbacks.length; i++) {
var fn = callbacks[i];

