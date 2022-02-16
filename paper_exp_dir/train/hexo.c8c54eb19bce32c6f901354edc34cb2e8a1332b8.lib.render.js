var async = require('async'),
pathFn = require('path'),
_ = require('lodash'),
swig = require('swig'),
util = require('./util'),
file = util.file2,
yfm = util.yfm;

var extend = hexo.extend,
renderer = extend.renderer.list(),
rendererSync = extend.renderer.list(true);

var getExtname = function(str){
