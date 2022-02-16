var pathFn = require('path');
var tildify = require('tildify');
var fs = require('hexo-fs');

require('colors');

module.exports = function(args){
var baseDir = this.base_dir;
var log = this.log;
var assetDir = pathFn.join(this.core_dir, 'assets');
var target = args._[0] ? pathFn.resolve(baseDir, args._[0]) : baseDir;

