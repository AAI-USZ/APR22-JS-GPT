


var Route = require('./route');
var Layer = require('./layer');
var methods = require('methods');
var mixin = require('utils-merge');
var debug = require('debug')('express:router');
var deprecate = require('depd')('express');
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
deprecate('name with leading colon: remove leading colon from ' + JSON.stringify(name));
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

