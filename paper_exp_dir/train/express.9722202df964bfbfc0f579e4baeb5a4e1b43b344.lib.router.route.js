

'use strict';



var debug = require('debug')('express:router:route');
var flatten = require('array-flatten');
var Layer = require('./layer');
var methods = require('methods');



var slice = Array.prototype.slice;
var toString = Object.prototype.toString;



module.exports = Route;



function Route(path) {
this.path = path;
this.stack = [];

debug('new %o', path)


this.methods = {};
}



Route.prototype._handles_method = function _handles_method(method) {
if (this.methods._all) {
return true;
}

var name = method.toLowerCase();

if (name === 'head' && !this.methods['head']) {
name = 'get';
}

return Boolean(this.methods[name]);
};



Route.prototype._options = function _options() {
var methods = Object.keys(this.methods);


if (this.methods.get && !this.methods.head) {
methods.push('head');
}

for (var i = 0; i < methods.length; i++) {

methods[i] = methods[i].toUpperCase();
}

return methods;
};



Route.prototype.dispatch = function dispatch(req, res, done) {
var idx = 0;
var stack = this.stack;
if (stack.length === 0) {
return done();
}

var method = req.method.toLowerCase();
if (method === 'head' && !this.methods['head']) {
method = 'get';
}

req.route = this;

next();

function next(err) {

if (err && err === 'route') {
return done();
}


if (err && err === 'router') {
return done(err)
}

