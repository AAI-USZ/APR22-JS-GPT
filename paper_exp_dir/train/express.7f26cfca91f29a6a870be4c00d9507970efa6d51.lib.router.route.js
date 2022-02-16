

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



Route.prototype._options = function(){
return Object.keys(this.methods).map(function(method) {
return method.toUpperCase();
});
};



Route.prototype.dispatch = function(req, res, done){
var stack = this.stack;
if (stack.length === 0) {
return done();
}

var method = req.method.toLowerCase();
if (method === 'head' && !this.methods['head']) {
method = 'get';
}
