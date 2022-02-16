var pathFn = require('path');
var fs = require('hexo-fs');

require('colors');

module.exports = function(ctx){
if (!ctx.env.init || ctx.env.safe) return;

var pluginDir = ctx.plugin_dir;
var currentName = '';

