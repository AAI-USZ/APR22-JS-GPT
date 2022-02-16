var util = require('./util'),
file = util.file,
fs = require('graceful-fs'),
_ = require('underscore'),
store = {},
cachePath;

exports.init = function(root, callback){
cachePath = root + '/.cache';
fs.exists(cachePath, function(exist){
if (exist){
file.read(cachePath, function(err, content){
try {
store = JSON.parse(content);
} finally {
callback();
}
});
} else {
callback();
}
});
