var fs = require('graceful-fs'),
util = require('../util'),
file = util.file2,
sourceDir = hexo.source_dir,
model = hexo.model;

model.extend('Cache', {
loadCache: function(path, callback){
var source = sourceDir + path,
self = this;

fs.stat(source, function(err, stats){
if (err) return callback(err);
