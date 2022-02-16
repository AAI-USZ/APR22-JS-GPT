'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var util = require('hexo-util');
var highlight = util.highlight;

var rCaptionTitleFile = /(.*)?(\s+|^)(\

module.exports = function(ctx){
return function includeCodeTag(args){
