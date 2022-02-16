var fs = require('graceful-fs'),
moment = require('moment'),
path = require('path'),
util = require('../../util'),
escape = util.escape;

module.exports = function(data, replace, callback){
var sourceDir = hexo.source_dir,
config = hexo.config,
newPostName = config.new_post_name,
layout = data.layout,
date = data.date,
slug = data.slug,
target = '';

if (layout === 'page'){
if (data.path){
target = path.join(sourceDir, data.path);
