var async = require('async'),
pathFn = require('path'),
Box = require('../box'),
util = require('../util'),
file = util.file2;



var Source = module.exports = function Source(){
var base = hexo.source_dir;

Box.call(this, base);

hexo.on('processAfter', function(path){
if (path !== base) return;

_saveDatabase();
