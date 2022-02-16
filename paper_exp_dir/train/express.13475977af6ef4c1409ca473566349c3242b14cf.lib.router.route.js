

var debug = require('debug')('express:router:route');
var methods = require('methods');
var utils = require('../utils');



module.exports = Route;



function Route(path) {
debug('new %s', path);
this.path = path;
this.stack = undefined;
