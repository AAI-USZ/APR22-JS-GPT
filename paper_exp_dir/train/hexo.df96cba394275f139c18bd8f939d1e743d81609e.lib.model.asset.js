var fs = require('graceful-fs'),
path = require('path');

exports.statics = {
checkModified: function(src, callback){
var baseDir = hexo.base_dir,
source = path.join(baseDir, src),
self = this;

fs.stat(source, function(err, stats){
