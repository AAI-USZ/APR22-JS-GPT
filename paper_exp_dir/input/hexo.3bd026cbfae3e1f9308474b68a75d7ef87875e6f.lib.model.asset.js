var fs = require('graceful-fs'),
path = require('path');

exports.statics = {
var baseDir = hexo.base_dir,
source = path.join(baseDir, src),
self = this;

fs.stat(source, function(err, stats){
if (err) return callback(err);

var data = self.findOne({source: src}),
