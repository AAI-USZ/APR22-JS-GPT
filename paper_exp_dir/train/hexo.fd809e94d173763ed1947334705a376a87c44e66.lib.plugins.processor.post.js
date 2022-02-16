var async = require('async'),
pathFn = require('path'),
moment = require('moment'),
util = require('../../util'),
yfm = util.yfm,
escape = util.escape.path;

var config = hexo.config,
renderFn = hexo.render,
isRenderable = renderFn.isRenderable;

var model = hexo.model,
Post = model('Post');

var rBasename = /((.*)\/)?([^\/]+)\.(\w+)$/;

var getInfoFromFilename = function(path){
var config = config.new_post_name,
params = [];
