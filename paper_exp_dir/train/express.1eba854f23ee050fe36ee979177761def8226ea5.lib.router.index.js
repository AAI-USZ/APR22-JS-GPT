

var Route = require('./route')
, Layer = require('./layer')
, methods = require('methods')
, debug = require('debug')('express:router')
, parseUrl = require('parseurl');



var proto = module.exports = function(options) {
options = options || {};

function router(req, res, next) {
router.handle(req, res, next);
}


router.__proto__ = proto;

router.params = {};
router._params = [];
router.caseSensitive = options.caseSensitive;
router.strict = options.strict;
router.stack = [];

return router;
};



proto.param = function(name, fn){

if ('function' == typeof name) {
this._params.push(name);
return;
}


var params = this._params
, len = params.length
, ret;

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

var method = req.method.toLowerCase();

var search = 1 + req.url.indexOf('?');
var pathlength = search ? search - 1 : req.url.length;
var fqdn = 1 + req.url.substr(0, pathlength).indexOf('://');
var protohost = fqdn ? req.url.substr(0, req.url.indexOf('/', 2 + fqdn)) : '';
var idx = 0;
var removed = '';
var slashAdded = false;



var options = [];


var stack = self.stack;


if (method === 'options') {
var old = done;
done = function(err) {
if (err || options.length === 0) return old(err);

var body = options.join(',');
return res.set('Allow', body).send(body);
};
}

(function next(err) {
if (err === 'route') {
err = undefined;
}

var layer = stack[idx++];
if (!layer) {
return done(err);
}

if (slashAdded) {
req.url = req.url.substr(1);
slashAdded = false;
}

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

req.route = route;


if (method === 'options' && !route.methods['options']) {
options.push.apply(options, route._options());
}
}

req.params = layer.params;


return self.process_params(layer, req, res, function(err) {
if (err) {
return next(err);
}

if (route) {
return layer.handle(req, res, next);
}

trim_prefix();
});

function trim_prefix() {
var c = path[layer.path.length];
if (c && '/' != c && '.' != c) return next(err);



debug('trim prefix (%s) from url %s', removed, req.url);
removed = layer.path;
req.url = protohost + req.url.substr(protohost.length + removed.length);


if (!fqdn && '/' != req.url[0]) {
req.url = '/' + req.url;
slashAdded = true;
}

debug('%s %s : %s', layer.handle.name || 'anonymous', layer.path, req.originalUrl);
var arity = layer.handle.length;
if (err) {
if (arity === 4) {
layer.handle(err, req, res, next);
} else {
next(err);
}
} else if (arity < 4) {
layer.handle(req, res, next);
} else {
next(err);
}
}
} catch (err) {
next(err);
}
})();
};



proto.process_params = function(route, req, res, done) {
var params = this.params;


var keys = route.keys;


if (!keys || keys.length === 0) {
return done();
}

var i = 0;
var paramIndex = 0;
var key;
var paramVal;
var paramCallbacks;



function param(err) {
if (err) {
return done(err);
}

if (i >= keys.length ) {
return done();
}

paramIndex = 0;
key = keys[i++];
paramVal = key && req.params[key.name];
paramCallbacks = key && params[key.name];

try {
if (paramCallbacks && undefined !== paramVal) {
return paramCallback();
} else if (key) {
return param();
}
} catch (err) {
return done(err);
}

done();
}


function paramCallback(err) {
var fn = paramCallbacks[paramIndex++];
if (err || !fn) return param(err);
fn(req, res, paramCallback, paramVal, key.name);
}

param();
};



proto.use = function(route, fn){

if ('string' != typeof route) {
fn = route;
route = '/';
}

if (typeof fn !== 'function') {
var type = {}.toString.call(fn);
var msg = 'Router.use() requires callback functions but got a ' + type;
throw new Error(msg);
}


if ('/' == route[route.length - 1]) {
route = route.slice(0, -1);
}

var layer = new Layer(route, {
sensitive: this.caseSensitive,
strict: this.strict,
end: false
}, fn);


debug('use %s %s', route || '/', fn.name || 'anonymous');

this.stack.push(layer);
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
route[method].apply(route, [].slice.call(arguments, 1));
return this;
};
});
