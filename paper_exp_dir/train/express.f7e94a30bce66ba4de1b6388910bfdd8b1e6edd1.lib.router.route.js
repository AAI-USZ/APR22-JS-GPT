

var debug = require('debug')('express:router:route');
var flatten = require('array-flatten');
var Layer = require('./layer');
var methods = require('methods');



module.exports = Route;



function Route(path) {
debug('new %s', path);
this.path = path;
this.stack = [];


this.methods = {};
}



Route.prototype._handles_method = function _handles_method(method) {
if (this.methods._all) {
return true;
}

method = method.toLowerCase();

if (method === 'head' && !this.methods['head']) {
method = 'get';
}

return Boolean(this.methods[method]);
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



Route.prototype.dispatch = function(req, res, done){
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

var layer = stack[idx++];
if (!layer) {
return done(err);
}

if (layer.method && layer.method !== method) {
return next(err);
}

if (err) {
layer.handle_error(err, req, res, next);
} else {
layer.handle_request(req, res, next);
}
}
};



Route.prototype.all = function(){
var callbacks = flatten([].slice.call(arguments));
callbacks.forEach(function(fn) {
if (typeof fn !== 'function') {
var type = {}.toString.call(fn);
var msg = 'Route.all() requires callback functions but got a ' + type;
throw new Error(msg);
}

var layer = Layer('/', {}, fn);
layer.method = undefined;

this.methods._all = true;
this.stack.push(layer);
}, this);

return this;
};

methods.forEach(function(method){
Route.prototype[method] = function(){
var callbacks = flatten([].slice.call(arguments));

callbacks.forEach(function(fn) {
if (typeof fn !== 'function') {
var type = {}.toString.call(fn);
var msg = 'Route.' + method + '() requires callback functions but got a ' + type;
throw new Error(msg);
}

debug('%s %s', method, this.path);

var layer = Layer('/', {}, fn);
layer.method = method;

this.methods[method] = true;
this.stack.push(layer);
}, this);
return this;
};
});
