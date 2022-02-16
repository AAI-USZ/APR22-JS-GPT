var async = require('async'),
pathFn = require('path'),
fs = require('graceful-fs'),
_ = require('lodash'),
swig = require('swig'),
util = require('./util'),
file = util.file2,
yfm = util.yfm;

var extend = hexo.extend,
renderer = extend.renderer.list(),
rendererSync = extend.renderer.list(true),
