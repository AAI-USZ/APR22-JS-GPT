var pathFn = require('path');

var processor = hexo.extend.processor,
rHiddenFile = /^[^_](?:(?!\/_).)*$/,
rTmpFile = /[~%]$/,
postDir = '_posts/',
postDirLength = postDir.length;

exports.regex = {
hiddenFile: rHiddenFile,
tmpFile: rTmpFile
};

processor.register(function(path){
if (!hexo.render.isRenderable(path)) return false;
if (rTmpFile.test(path)) return false;
if (path.substring(0, postDirLength) !== postDir) return false;

var str = path.substring(postDirLength);
