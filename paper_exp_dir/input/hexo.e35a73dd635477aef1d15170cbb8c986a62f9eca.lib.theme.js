var extend = require('./extend'),
renderer = extend.renderer.list(),
helper = extend.helper.list(),
i18n = require('./i18n').i18n,
render = require('./render'),
renderSync = render.renderSync,
route = require('./route'),
util = require('./util'),
file = util.file,
yfm = util.yfm,
async = require('async'),
fs = require('fs'),
path = require('path'),
sep = path.sep,
_ = require('underscore'),
baseDir = hexo.base_dir,
themeDir = hexo.theme_dir,
cache = {};

exports.layout = function(callback){
var layoutDir = themeDir + 'layout' + sep;

file.dir(layoutDir, function(files){
async.forEach(files, function(item, next){
var extname = path.extname(item),
dirs = item.split(sep);

for (var i=0, len=dirs.length; i<len; i++){
var front = dirs[i].substr(0, 1);
if (front === '_' || front === '.') return next();
}

file.read(layoutDir + item, function(err, content){
if (err) throw new Error('Failed to read file: ' + layoutDir + item);

var name = item.substring(0, item.length - extname.length);
cache[name] = yfm(content);
cache[name].source = layoutDir + item;
next();
});
}, callback);
});
};

exports.source = function(callback){
var rendererList = Object.keys(renderer),
compile = render.compile;

