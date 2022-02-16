


var Route = require('./route');
var Layer = require('./layer');
var methods = require('methods');
var mixin = require('utils-merge');
var debug = require('debug')('express:router');
var parseUrl = require('parseurl');
var utils = require('../utils');



var objectRegExp = /^\[object (\S+)\]$/;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;



var proto = module.exports = function(options) {
options = options || {};

function router(req, res, next) {
router.handle(req, res, next);
}


router.__proto__ = proto;

router.params = {};
router._params = [];
router.caseSensitive = options.caseSensitive;
router.mergeParams = options.mergeParams;
router.strict = options.strict;
router.stack = [];

return router;
};



proto.param = function(name, fn){

if ('function' == typeof name) {
this._params.push(name);
return;
}


var params = this._params;
var len = params.length;
var ret;

if (name[0] === ':') {
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



proto.handle = function(req, res, done) {
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
done = restore(done, req, 'baseUrl', 'next', 'params');


req.next = next;


if (req.method === 'OPTIONS') {
done = wrap(done, function(old, err) {
if (err || options.length === 0) return old(err);

var body = options.join(',');
return res.set('Allow', body).send(body);
});
}


req.baseUrl = parentUrl;
req.originalUrl = req.originalUrl || req.url;

next();

function next(err) {
var layerError = err === 'route'
? null
: err;

var layer = stack[idx++];

if (slashAdded) {
req.url = req.url.substr(1);
slashAdded = false;
}

if (removed.length !== 0) {
req.baseUrl = parentUrl;
req.url = protohost + removed + req.url.substr(protohost.length);
removed = '';
}

if (!layer) {
return done(layerError);
}

self.match_layer(layer, req, res, function (err, path) {
if (err || path === undefined) {
return next(layerError || err);
}


var route = layer.route;


if (route) {

if (layerError) {
return next(layerError);
}

var method = req.method;
var has_method = route._handles_method(method);


if (!has_method && method === 'OPTIONS') {
options.push.apply(options, route._options());
}


if (!has_method && method !== 'HEAD') {
return next();
}


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



proto.match_layer = function match_layer(layer, req, res, done) {
var error = null;
var path;

try {
path = parseUrl(req).pathname;

if (!layer.match(path)) {
path = undefined;
}
} catch (err) {
error = err;
}

done(error, path);
};



proto.process_params = function(layer, called, req, res, done) {
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


if (paramCalled && (paramCalled.error || paramCalled.match === paramVal)) {

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

var callbacks = utils.flatten(slice.call(arguments, offset));

if (callbacks.length === 0) {
throw new TypeError('Router.use() requires middleware functions');
}

callbacks.forEach(function (fn) {
if (typeof fn !== 'function') {
throw new TypeError('Router.use() requires middleware function but got a ' + gettype(fn));
}


debug('use %s %s', path, fn.name || '<anonymous>');

var layer = new Layer(path, {
sensitive: this.caseSensitive,
strict: false,
end: false
}, fn);

layer.route = undefined;

this.stack.push(layer);
}, this);

return this;
};



proto.route = function(path){
var route = new Route(path);

var layer = new Layer(path, {
sensitive: this.caseSensitive,
strict: this.strict,
end: true
}, route.dispatch.bind(route));

layer.route = route;

this.stack.push(layer);
return route;
};


methods.concat('all').forEach(function(method){
proto[method] = function(path){
var route = this.route(path)
route[method].apply(route, slice.call(arguments, 1));
return this;
};
});


function gettype(obj) {
var type = typeof obj;

if (type !== 'object') {
return type;
}


return toString.call(obj)
.replace(objectRegExp, '$1');
}


function mergeParams(params, parent) {
if (typeof parent !== 'object' || !parent) {
return params;
}


var obj = mixin({}, parent);


if (!(0 in params) || !(0 in parent)) {
return mixin(obj, params);
}

var i = 0;
var o = 0;


while (i === o || o in parent) {
if (i in params) i++;
if (o in parent) o++;
}


for (i--; i >= 0; i--) {
params[i + o] = params[i];


if (i < o) {
delete params[i];
}
}

return mixin(parent, params);
}


function restore(fn, obj) {
var props = new Array(arguments.length - 2);
var vals = new Array(arguments.length - 2);

for (var i = 0; i < props.length; i++) {
props[i] = arguments[i + 2];
vals[i] = obj[props[i]];
}

return function(err){

for (var i = 0; i < props.length; i++) {
obj[props[i]] = vals[i];
}

return fn.apply(this, arguments);
};
}


function wrap(old, fn) {
return function proxy() {
var args = new Array(arguments.length + 1);

args[0] = old;
for (var i = 0, len = arguments.length; i < len; i++) {
args[i + 1] = arguments[i];
}

fn.apply(this, args);
};
}
