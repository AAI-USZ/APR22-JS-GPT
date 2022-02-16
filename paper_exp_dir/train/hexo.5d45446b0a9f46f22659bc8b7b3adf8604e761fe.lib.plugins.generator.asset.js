var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
HexoError = require('../../error');

var _generate = function(asset){
var isRenderable = hexo.render.isRenderable,
route = hexo.route,
source = asset.full_source,
path = asset.path;

if (isRenderable(path)){
