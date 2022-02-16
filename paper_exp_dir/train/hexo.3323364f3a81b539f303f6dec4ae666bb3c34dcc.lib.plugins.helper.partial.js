var pathFn = require('path');
var _ = require('lodash');

require('colors');

module.exports = function(ctx){
return function(name, locals, options){
options = options || {};

var cache = options.cache;
var only = options.only;
var viewDir = this.view_dir;
