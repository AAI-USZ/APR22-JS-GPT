

var Route = require('./route');
var Layer = require('./layer');
var methods = require('methods');
var mixin = require('utils-merge');
var debug = require('debug')('express:router');
var parseUrl = require('parseurl');
var slice = Array.prototype.slice;



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
var fqdn = 1 + req.url.substr(0, pathlength).indexOf('://');
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

next();

function next(err) {
if (err === 'route') {
err = undefined;
}

var layer = stack[idx++];
var layerPath;

if (!layer) {
return done(err);
}

if (slashAdded) {
req.url = req.url.substr(1);
slashAdded = false;
}

req.baseUrl = parentUrl;
req.url = protohost + removed + req.url.substr(protohost.length);
req.originalUrl = req.originalUrl || req.url;
removed = '';

try {
var path = parseUrl(req).pathname;
if (undefined == path) path = '/';

if (!layer.match(path)) return next(err);


var route = layer.route;


if (route) {

if (err) {
return next(err);
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
layerPath = layer.path;


return self.process_params(layer, paramcalled, req, res, function(err) {
if (err) {
return next(err);
}

if (route) {
return layer.handle(req, res, next);
}

trim_prefix();
});

} catch (err) {
next(err);
}

function trim_prefix() {
var c = path[layerPath.length];
if (c && '/' != c && '.' != c) return next(err);



removed = layerPath;
if (removed.length) {
debug('trim prefix (%s) from url %s', layerPath, req.url);
req.url = protohost + req.url.substr(protohost.length + removed.length);
}


if (!fqdn && req.url[0] !== '/') {
req.url = '/' + req.url;
slashAdded = true;
}


if (removed.length && removed.substr(-1) === '/') {
req.baseUrl = parentUrl + removed.substring(0, removed.length - 1);
} else {
req.baseUrl = parentUrl + removed;
}

debug('%s %s : %s', layer.handle.name || 'anonymous', layerPath, req.originalUrl);
var arity = layer.handle.length;
try {
if (err && arity === 4) {
layer.handle(err, req, res, next);
} else if (!err && arity < 4) {
layer.handle(req, res, next);
} else {
next(err);
}
} catch (err) {
next(err);
}
}
}
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

try {
return paramCallback();
} catch (err) {
return done(err);
}
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

fn(req, res, paramCallback, paramVal, key.name);
}

param();
};



proto.use = function(path, fn){

if (arguments.length < 2) {
fn = path;
path = '/';
}

if (typeof fn !== 'function') {
var type = {}.toString.call(fn);
var msg = 'Router.use() requires callback functions but got a ' + type;
throw new Error(msg);
}

var layer = new Layer(path, {
sensitive: this.caseSensitive,
strict: false,
end: false
}, fn);

