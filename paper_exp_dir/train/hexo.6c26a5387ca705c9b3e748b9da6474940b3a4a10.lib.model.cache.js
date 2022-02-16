var async = require('async'),
fs = require('graceful-fs'),
util = require('../util'),
file = util.file2,
sourceDir = hexo.source_dir,
model = hexo.model;

model.extend('Cache', {
loadCache: function(path, callback){
var source = sourceDir + path,
data = this.findOne({source: path}) || {},
self = this;

async.auto({
mtime: function(next){
fs.stat(source, function(err, stats){
if (err) return callback(err);

next(null, stats.mtime.getTime());
});
},
check: ['mtime', function(next, results){
if (data.mtime && data.mtime == results.mtime) return callback(null, data);
