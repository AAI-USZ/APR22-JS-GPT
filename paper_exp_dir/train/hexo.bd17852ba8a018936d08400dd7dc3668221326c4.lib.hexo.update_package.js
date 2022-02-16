var pathFn = require('path');
var fs = require('hexo-fs');

module.exports = function(ctx){
if (!ctx.env.init) return;

var packagePath = pathFn.join(ctx.base_dir, 'package.json');
var log = ctx.log;

return fs.exists(packagePath).then(function(exist){
if (exist) return;
