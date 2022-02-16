

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

req.params = req.params || {};

for (var key in layer.params) {
req.params[key] = layer.params[key];
}


return self.process_params(layer, req, res, function(err) {
if (err) {
return next(err);
}

if (route) {
