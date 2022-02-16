'use strict';

var pathFn = require('path');
var fs = require('hexo-fs');

module.exports = function(ctx){
var pkgPath = pathFn.join(ctx.base_dir, 'package.json');

return readPkg(pkgPath).then(function(pkg){
if (!pkg) return;
