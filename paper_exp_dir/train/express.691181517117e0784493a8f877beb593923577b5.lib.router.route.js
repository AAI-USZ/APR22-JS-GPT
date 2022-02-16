


var debug = require('debug')('express:router:route')
, methods = require('methods')



module.exports = Route;



function Route(path) {
debug('new %s', path);
this.path = path;
this.stack = undefined;

