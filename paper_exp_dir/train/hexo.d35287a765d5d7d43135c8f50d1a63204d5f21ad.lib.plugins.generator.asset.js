var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
HexoError = require('../../error');

var _generate = function(asset){
var isRenderable = hexo.render.isRenderable,
route = hexo.route,
source = asset.full_source,
path = asset.path,
dest,
content;

if (isRenderable(path)){
var extname = pathFn.extname(path),
filename = path.substring(0, path.length - extname.length),
subext = pathFn.extname(filename);
dest = filename + '.' + (subext ? subext.substring(1) : hexo.render.getOutput(path));

