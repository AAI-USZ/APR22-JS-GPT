var Promise = require('bluebird');
var pathFn = require('path');
var tildify = require('tildify');
var fs = require('hexo-fs');

require('colors');

module.exports = function(ctx){
return Promise.filter([
ctx.script_dir,
ctx.theme_script_dir
], function(scriptDir){
return scriptDir ? fs.exists(scriptDir) : false;
