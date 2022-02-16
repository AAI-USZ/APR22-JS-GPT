

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
options = options || {};

this.handle = fn;
this.name = fn.name || '<anonymous>';
this.params = undefined;
this.path = undefined;
this.regexp = pathRegexp(path, this.keys = [], options);

if (path === '/' && options.end === false) {
this.regexp.fast_slash = true;
}
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
if (path == null) {

this.params = undefined;
this.path = undefined;
return false;
}

if (this.regexp.fast_slash) {

this.params = {};
this.path = '';
return true;
}

var m = this.regexp.exec(path);

if (!m) {
this.params = undefined;
this.path = undefined;
return false;
}


this.params = {};
this.path = m[0];

var keys = this.keys;
var params = this.params;

for (var i = 1; i < m.length; i++) {
var key = keys[i - 1];
var prop = key.name;
var val = decode_param(m[i]);

if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
params[prop] = val;
}
}

return true;
};



function decode_param(val) {
if (typeof val !== 'string') {
return val;
}

try {
return decodeURIComponent(val);
} catch (err) {
if (err instanceof URIError) {
err.message = 'Failed to decode param \'' + val + '\'';
err.status = 400;
}

