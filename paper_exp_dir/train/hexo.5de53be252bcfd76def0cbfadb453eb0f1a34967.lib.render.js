var renderer = require('./extend').renderer.list(),
rendererSync = require('./extend').rendererSync.list(),
helper = require('./extend').helper.list(),
async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
_ = require('lodash'),
util = require('./util'),
file = util.file,
yfm = util.yfm,
cache = {};

var getExtname = function(str){
var extname = path.extname(str);
if (extname) str = extname;

if (str[0] === '.') str = str.substring(1);

return str;
};

var isRenderable = exports.isRenderable = function(str){
return renderer.hasOwnProperty(getExtname(str));
};

var isRenderableSync = exports.isRenderableSync = function(ext){
return rendererSync.hasOwnProperty(getExtname(str));
};

var getOutput = exports.getOutput = function(str){
if (isRenderable(str)) return renderer[getExtname(str)].output;
};

var render = exports.render = function(data, options, callback){
if (_.isFunction(options)){
callback = options;
options = {};
}

var text = data.text,
source = data.path;

async.series([
function(next){
if (text){
next(null);
} else if (source){
file.read(source, function(err, content){
if (err) return callback(err);
if (!content) return callback();

text = content;
next();
});
} else {
callback(new Error('No input file or string'));
}
},
function(next){
