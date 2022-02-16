var render = require('./render'),
list = Object.keys(require('./extend').render.list()),
partial = require('./partial'),
util = require('./util'),
file = util.file,
yfm = util.yfm,
async = require('async'),
path = require('path'),
_ = require('underscore'),
cache = {};

var config = exports.config = {};

exports.init = function(callback){
render.compile(hexo.theme_dir + '_config.yml', function(err, file){
if (err) throw err;

if (file){
for (var i in file){
(function(i){
config.__defineGetter__(i, function(){
return file[i];
});
})(i);
}

callback();
} else {
callback();
}
});
};

exports.assets = function(callback){
var themeDir = hexo.theme_dir,
publicDir = hexo.public_dir;

file.dir(themeDir, function(files){
async.forEach(files, function(item, next){
var extname = path.extname(item),
filename = path.basename(item, extname),
dirs = item.split('/');

for (var i=0, len=dirs.length; i<len; i++){
var front = dirs[i].substring(0, 1);
