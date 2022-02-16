var extend = require('../../extend'),
renderFn = require('../../render'),
render = renderFn.render,
isRenderable = renderFn.isRenderable,
getOutput = renderFn.getOutput,
util = require('../../util'),
file = util.file,
fs = require('graceful-fs'),
pathFn = require('path'),
_ = require('lodash'),
async = require('async');

extend.console.register('render', 'Render file', {init: true}, function(args, callback){
var baseDir = hexo.base_dir,
outputDir = args.o || args.output || baseDir;
