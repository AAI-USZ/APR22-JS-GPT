

'use strict';



var pathRegexp = require('path-to-regexp');
var debug = require('debug')('express:router:layer');



var hasOwnProperty = Object.prototype.hasOwnProperty;



module.exports = Layer;

function Layer(path, options, fn) {
if (!(this instanceof Layer)) {
return new Layer(path, options, fn);
}

debug('new %s', path);
var opts = options || {};

this.handle = fn;
this.name = fn.name || '<anonymous>';
this.params = undefined;
this.path = undefined;
this.regexp = pathRegexp(path, this.keys = [], opts);


this.regexp.fast_star = path === '*'
this.regexp.fast_slash = path === '/' && opts.end === false
}



Layer.prototype.handle_error = function handle_error(error, req, res, next) {
var fn = this.handle;

if (fn.length !== 4) {

return next(error);
}

try {
fn(error, req, res, next);
} catch (err) {
next(err);
}
};



Layer.prototype.handle_request = function handle(req, res, next) {
var fn = this.handle;

if (fn.length > 3) {

return next();
}

try {
fn(req, res, next);
} catch (err) {
next(err);
}
};



Layer.prototype.match = function match(path) {
var match

if (path != null) {

if (this.regexp.fast_slash) {
this.params = {}
this.path = ''
return true
}


if (this.regexp.fast_star) {
this.params = {'0': decode_param(path)}
this.path = path
return true
}
