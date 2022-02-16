var fs = require('graceful-fs');

exports.statics = {
checkModified: function(src, callback){
var baseDir = hexo.base_dir,
self = this;

fs.stat(src, function(err, stats){
if (err) return callback(err);

var path = src.substring(baseDir.length),
