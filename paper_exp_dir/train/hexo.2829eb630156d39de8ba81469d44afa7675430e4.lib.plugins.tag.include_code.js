var fs = require('graceful-fs'),
pathFn = require('path'),
util = require('../../util'),
file = util.file2,
highlight = util.highlight;

var rCaptionTitleFile = /(.*)?(\s+|^)(\

module.exports = function(args, callback){
var config = hexo.config.highlight ? hexo.config.highlight : {},
