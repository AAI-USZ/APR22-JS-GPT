var pathFn = require('path'),
fs = require('graceful-fs'),
Box = require('../box'),
util = require('../util'),
file = util.file2,
HexoError = require('../error');

var rHiddenFile = /\/_/;

var getScaffoldName = function(path){
return path.substring(hexo.scaffold_dir.length, path.length - pathFn.extname(path).length);
