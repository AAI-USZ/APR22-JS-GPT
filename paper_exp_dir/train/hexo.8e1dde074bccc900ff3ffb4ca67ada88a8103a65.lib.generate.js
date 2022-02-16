var extend = require('./extend'),
generator = extend.generator.list(),
processor = extend.processor.list(),
render = require('./render'),
util = require('./util'),
file = util.file,
async = require('async'),
fs = require('fs'),
config = hexo.config,
baseDir = hexo.base_dir,
publicDir = hexo.public_dir,
themeDir = hexo.theme_dir,
_ = require('underscore');

var freeze = function(obj){
var result = {};

_.each(obj, function(val, key){
result.__defineGetter__(key, function(){
return val;
});
});

Object.freeze(result);

return result;
};

module.exports = function(options, callback){
var theme = require('./theme'),
preview = options.preview,
watch = options.watch,
ignore = options.ignore,
publicExist = false;

async.auto({
load: function(next){
render.compile(themeDir + '_config.yml', next);
},
check: function(next){
if (preview) return next();
