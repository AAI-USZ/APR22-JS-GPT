var async = require('async'),
pathFn = require('path'),
_ = require('lodash'),
swig = require('swig'),
util = require('./util'),
file = util.file2,
yfm = util.yfm;

var extend = hexo.extend,
renderer = extend.renderer.list(),
rendererSync = extend.renderer.list(true),
filter = extend.filter.list(),
swigInit = false;

var rEscapeContent = /<escape( indent=['"](\d+)['"])?>([\s\S]+?)<\/escape>/g,
rLineBreak = /(\n(\t+)){2,}/g,
rUnescape = /<notextile>(\d+)<\/notextile>/g;

var getExtname = function(str){
return pathFn.extname(str).substring(1);
