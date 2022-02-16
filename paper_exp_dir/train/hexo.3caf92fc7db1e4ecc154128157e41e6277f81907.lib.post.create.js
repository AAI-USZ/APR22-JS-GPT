var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
moment = require('moment'),
swig = require('swig'),
util = require('../util'),
file = util.file2,
yfm = util.yfm,
escape = util.escape.filename;

swig.init({
autoescape: false
});

var _getFilename = function(data, replace, callback){
var sourceDir = hexo.source_dir,
layout = data.layout,
date = data.date,
slug = data.slug;

if (layout === 'page'){
if (data.path){
var target = path.join(sourceDir, slug, 'index.md');
} else {
var target = path.join(sourceDir, data.path);
}
} else {
var postDir = path.join(sourceDir, layout === 'draft' ? '_drafts' : '_posts');

if (data.path){
var filename = data.path;
