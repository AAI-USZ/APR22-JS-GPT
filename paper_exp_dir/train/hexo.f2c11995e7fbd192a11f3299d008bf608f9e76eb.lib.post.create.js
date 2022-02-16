

var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
moment = require('moment'),
swig = require('swig'),
util = require('../util'),
file = util.file2,
yfm = util.yfm,
escape = util.escape.filename;

var _getFilename = function(data, replace, callback){
var sourceDir = hexo.source_dir,
layout = data.layout,
date = data.date,
slug = data.slug;

if (layout === 'page'){
var target = path.join(sourceDir, slug, 'index.md');
} else {
var filename = hexo.config.new_post_name
.replace(/:year/g, date.year())
