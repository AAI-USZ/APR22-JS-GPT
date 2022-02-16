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
var newPostName = config.new_post_name,
params = [];

path = path.substring(0, path.length - pathFn.extname(path).length);

var pattern = newPostName.substring(0, newPostName.length - pathFn.extname(newPostName).length)
.replace(/(\/|\.)/g, '\\$&')
.replace(/:(\w+)/g, function(match, name){
if (name === 'year'){
params.push(name);
return '(\\d{4})';
} else if (name === 'month' || name === 'day'){
params.push(name);
