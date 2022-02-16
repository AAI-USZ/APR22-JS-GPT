'use strict';

var Pattern = require('hexo-util').Pattern;
var pathFn = require('path');

exports.process = function(file){
var path = file.params.path;
var extname = pathFn.extname(path);
var name = path.substring(0, path.length - extname.length);
var i18n = file.box.i18n;
