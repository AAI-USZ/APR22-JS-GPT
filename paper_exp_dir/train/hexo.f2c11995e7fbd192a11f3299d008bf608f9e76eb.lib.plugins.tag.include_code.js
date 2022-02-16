var fs = require('graceful-fs'),
pathFn = require('path'),
util = require('../../util'),
file = util.file2,
highlight = util.highlight;

var rCaptionTitleFile = /(.*)?(\s+|^)(\

module.exports = function(args, callback){
var codeDir = hexo.config.code_dir,
sourceDir = hexo.source_dir,
config = hexo.config.highlight || {},
arg = args.join(' ');


if (codeDir[codeDir.length - 1] !== '/') codeDir += '/';

