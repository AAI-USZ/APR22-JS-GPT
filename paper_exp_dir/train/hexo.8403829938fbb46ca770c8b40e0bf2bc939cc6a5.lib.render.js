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

var isRenderable = exports.isRenderable = function(ext){
return renderer.hasOwnProperty(ext);
};

var isRenderableSync = exports.isRenderableSync = function(ext){
return rendererSync.hasOwnProperty(ext);
};

var getOutput = exports.getOutput = function(ext){
return renderer[ext].output;
