var pathFn = require('path');

var processor = hexo.extend.processor,
rHiddenFile = /^[^_](?:(?!\/_).)*$/,
rTmpFile = /[~%]$/;

processor.register(function(path){
if (rTmpFile.test(path)) return false;
if (!hexo.render.isRenderable(path)) return false;

var dirname = pathFn.dirname(path);
if (dirname !== '_posts') return false;
