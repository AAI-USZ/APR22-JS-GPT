var async = require('async'),
pathFn = require('path'),
moment = require('moment'),
fs = require('fs'),
util = require('../../util'),
yfm = util.yfm,
file = util.file2,
escape = util.escape.path;

var rBasename = /((.*)\/)?([^\/]+)\.(\w+)$/,
rHiddenFile = /^_|\/_|[~%]$/;

var getInfoFromFilename = function(path){
var newPostName = hexo.config.new_post_name,
