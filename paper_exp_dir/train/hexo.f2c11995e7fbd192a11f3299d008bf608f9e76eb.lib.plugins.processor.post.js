var async = require('async'),
pathFn = require('path'),
moment = require('moment'),
util = require('../../util'),
yfm = util.yfm,
escape = util.escape.path;

var rBasename = /((.*)\/)?([^\/]+)\.(\w+)$/;

var getInfoFromFilename = function(path){
var newPostName = hexo.config.new_post_name,
params = [];

path = path.substring(0, path.length - pathFn.extname(path).length);

var pattern = newPostName.substring(0, newPostName.length - pathFn.extname(newPostName).length)
.replace(/(\/|\.)/g, '\\$&')
