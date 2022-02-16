var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
HexoError = require('../../error');

module.exports = function(locals, render, callback){
var baseDir = hexo.base_dir,
renderFn = hexo.render,
render = renderFn.render,
isRenderable = renderFn.isRenderable,
getOutput = renderFn.getOutput;

async.each(hexo.model('Asset').toArray(), function(asset, next){
var path = asset.path,
source = pathFn.join(baseDir, asset._id);
