




var path = require('path')
, basename = path.basename
, dirname = path.dirname
, extname = path.extname;



var cache = {
basename: {}
, dirname: {}
, extname: {}
};



exports.basename = function(path){
return cache.basename[path]
|| (cache.basename[path] = basename(path));
};



exports.dirname = function(path){
return cache.dirname[path]
|| (cache.dirname[path] = dirname(path));
};



exports.extname = function(path){
return cache.extname[path]
|| (cache.extname[path] = extname(path));
};



exports.union = function(a, b){
if (a && b) {
var keys = Object.keys(b)
, len = keys.length
, key;
for (var i = 0; i < len; ++i) {
key = keys[i];
if (!a.hasOwnProperty(key)) {
a[key] = b[key];
}
}
}
