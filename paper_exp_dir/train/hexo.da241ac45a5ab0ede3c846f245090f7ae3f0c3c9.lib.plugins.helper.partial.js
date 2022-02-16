'use strict';

var pathFn = require('path');
var _ = require('lodash');
var chalk = require('chalk');

module.exports = function(ctx) {
return function partial(name, locals, options) {
if (typeof name !== 'string') throw new TypeError('name must be a string!');

options = options || {};

var cache = options.cache;
var viewDir = this.view_dir;
var currentView = this.filename.substring(viewDir.length);
var path = pathFn.join(pathFn.dirname(currentView), name);
var view = ctx.theme.getView(path) || ctx.theme.getView(name);
var viewLocals = { layout: false };

if (!view) {
ctx.log.warn('Partial %s does not exist. %s', chalk.magenta(name), chalk.gray('(in ' + currentView + ')'));
return '';
}
