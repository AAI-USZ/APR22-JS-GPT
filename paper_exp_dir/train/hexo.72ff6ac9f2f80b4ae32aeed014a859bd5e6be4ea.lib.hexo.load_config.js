var _ = require('lodash');
var pathFn = require('path');
var tildify = require('tildify');
var Theme = require('../theme');
var Source = require('./source');
var fs = require('hexo-fs');
var chalk = require('chalk');

module.exports = function(ctx){
var baseDir = ctx.base_dir;
var configPath = ctx.config_path;
var extname = pathFn.extname(configPath);
var dirname = pathFn.dirname(configPath);
var basename = pathFn.basename(configPath, extname);

return fs.readdir(dirname).then(function(files){
