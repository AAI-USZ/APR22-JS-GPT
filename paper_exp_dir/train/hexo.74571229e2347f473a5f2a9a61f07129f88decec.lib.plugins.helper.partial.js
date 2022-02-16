'use strict';

var pathFn = require('path');
var _ = require('lodash');
var chalk = require('chalk');

module.exports = function(ctx){
return function partial(name, locals, options){
if (typeof name !== 'string') throw new TypeError('name must be a string!');

options = options || {};
