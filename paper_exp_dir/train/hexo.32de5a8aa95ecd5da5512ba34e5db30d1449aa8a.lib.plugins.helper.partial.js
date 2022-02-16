var pathFn = require('path');
var _ = require('lodash');
var chalk = require('chalk');

module.exports = function(ctx){
return function partial(name, locals, options){
if (typeof name !== 'string') throw new TypeError('name must be a string!');

options = options || {};

var cache = options.cache;
var only = options.only;
var viewDir = this.view_dir;
var path = pathFn.join(pathFn.dirname(this.filename.substring(viewDir.length)), name);
var view = ctx.theme.getView(path) || ctx.theme.getView(name);
var viewLocals = {};

