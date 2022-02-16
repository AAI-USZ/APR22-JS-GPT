var render = require('./render'),
util = require('./util'),
file = util.file,
yfm = util.yfm,
async = require('async'),
path = require('path'),
_ = require('underscore'),
extCache = {};

var config = exports.config = {};

exports.init = function(callback){
render.compile(hexo.theme_dir + 'config.yml', function(err, file){
if (err) throw err;

if (file){
for (var i in file){
(function(i){
config.__defineGetter__(i, function(){
return file[i];
});
})(i);

callback();
}
console.log(file);
} else {
callback();
}
});
};

var layout = exports.layout = {};

exports.assets = function(callback){
var themeDir = hexo.theme_dir,
publicDir = hexo.public_dir,
cache = {};

file.dir(themeDir, function(files){
async.forEach(files, function(item, next){
var extname = path.extname(item),
filename = path.basename(item, extname),
dirs = path.dirname(item).split('/');

if (filename.substring(0, 1) === '_' || filename.substring(0, 1) === '.'){
next(null);
} else {
if (dirs[0] === 'layout'){
file.read(themeDir + item, function(err, file){
if (err) throw err;
cache[filename] = yfm(file);
extCache[filename] = extname.substring(1);
next(null);
});
