var fs = require('graceful-fs'),
moment = require('moment'),
path = require('path'),
util = require('../../util'),
escape = util.escape,
Permalink = util.permalink,
permalink;

module.exports = function(data, replace, callback){
var sourceDir = hexo.source_dir,
layout = data.layout,
date = data.date,
slug = data.slug,
target = '';
