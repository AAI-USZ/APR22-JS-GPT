

var async = require('async'),
pathFn = require('path'),
fs = require('graceful-fs'),
_ = require('lodash'),
util = require('../util'),
file = util.file2,
yfm = util.yfm;

var cache = {};

var getExtname = function(str){
return pathFn.extname(str).replace(/^\./, '');
};



var isRenderable = exports.isRenderable = function(path){
return hexo.extend.renderer.isRenderable(path);
};



var isRenderableSync = exports.isRenderableSync = function(path){
return hexo.extend.renderer.isRenderableSync(path);
};



var getOutput = exports.getOutput = function(path){
return hexo.extend.renderer.getOutput(path);
};



var render = exports.render = function(data, options, callback){
if (!callback){
if (typeof options === 'function'){
callback = options;
options = {};
} else {
callback = function(){};
}
}

async.waterfall([
function(next){
if (!data.path) return next(new Error('No input file or string'));

file.readFile(data.path, next);
},
function(text, next){
var ext = data.engine || getExtname(data.path);

if (ext && isRenderable(ext)){
var renderer = hexo.extend.renderer.get(ext);

renderer({
path: data.path,
text: text
}, options, next);
} else {
next(null, text);
}
}
], callback);
};



exports.renderSync = function(data, options){
