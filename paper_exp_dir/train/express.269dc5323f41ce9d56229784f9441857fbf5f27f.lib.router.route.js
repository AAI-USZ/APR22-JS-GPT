

var debug = require('debug')('express:router:route');
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

