var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
_ = require('lodash'),
util = require('../../util'),
file = util.file2;

module.exports = function(args, callback){

if (!args._.length){
hexo.call('help', {_: ['render']}, callback);
return;
}

var renderFn = hexo.render,
render = renderFn.render,
isRenderable = renderFn.isRenderable,
getOutput = renderFn.getOutput;
