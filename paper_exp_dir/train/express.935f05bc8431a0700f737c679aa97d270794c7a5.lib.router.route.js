

var debug = require('debug')('express:router:route');
var Layer = require('./layer');
var methods = require('methods');
var utils = require('../utils');



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
