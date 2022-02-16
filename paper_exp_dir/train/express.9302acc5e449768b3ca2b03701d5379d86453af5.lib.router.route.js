

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

debug('new %s', path);
