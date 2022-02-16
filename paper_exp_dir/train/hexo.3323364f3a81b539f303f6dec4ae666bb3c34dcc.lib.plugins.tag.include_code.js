var fs = require('graceful-fs'),
pathFn = require('path'),
util = require('../../util'),
file = util.file2,
highlight = util.highlight;

var rCaptionTitleFile = /(.*)?(\s+|^)(\

module.exports = function(ctx){
return function(args){
var codeDir = ctx.config.code_dir,
sourceDir = ctx.source_dir,
config = ctx.config.highlight || {},
arg = args.join(' '),
path = '',
title = '',
lang = '',
caption = '';
