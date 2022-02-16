var moment = require('moment'),
clc = require('cli-color'),
fs = require('graceful-fs'),
path = require('path'),
sep = path.sep,
extend = require('../extend'),
util = require('../util'),
file = util.file;

var downcase = function(str){
return str.toLowerCase().replace(/\s/g, '-');
};

extend.console.register('new', 'Create a new article', function(args){
if (!args.length){
console.log('Usage: hexo new [layout] <title>');
return false;
}

