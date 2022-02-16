var fs = require('fs'),
async = require('async'),
colors = require('colors'),
path = require('path'),
moment = require('moment'),
util = require('../../util'),
file = util.file2,
yfm = util.yfm;

var _draftDir = function(){
return path.join(hexo.source_dir, '_drafts') + path.sep;
};

var _postDir = function(){
return path.join(hexo.source_dir, '_posts') + path.sep;
};

var _publishPost = function(filename, callback){
var src = path.join(_draftDir(), filename + '.md'),
dest = path.join(_postDir(), filename + '.md');
