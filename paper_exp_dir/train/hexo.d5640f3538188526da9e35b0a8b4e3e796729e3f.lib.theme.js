var render = require('./render'),
util = require('./util'),
file = util.file,
yfm = util.yfm,
partial = util.partial,
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

callback();
}
} else {
callback();
}
});
};

exports.assets = function(callback){
var themeDir = hexo.theme_dir,
publicDir = hexo.public_dir;

