var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
_ = require('lodash'),
util = require('./util'),
file = util.file2;

var extend = hexo.extend,
processors = extend.processor.list(),
sourceDir = hexo.source_dir;
