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
