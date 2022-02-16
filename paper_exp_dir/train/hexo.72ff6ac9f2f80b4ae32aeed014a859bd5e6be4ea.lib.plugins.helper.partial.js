var pathFn = require('path');
var _ = require('lodash');
var chalk = require('chalk');

module.exports = function(ctx){
return function(name, locals, options){
options = options || {};

var cache = options.cache;
var only = options.only;
var viewDir = this.view_dir;
var path = pathFn.join(pathFn.dirname(this.filename.substring(viewDir.length)), name);
