var moment = require('moment'),
clc = require('cli-color'),
fs = require('graceful-fs'),
path = require('path'),
sep = path.sep,
extend = require('../extend'),
util = require('../util'),
file = util.file;

extend.console.register('new_post', 'Create a new post', function(args){
if (!args.length){
console.log('Usage: hexo new_post <title>');
return false;
}

var now = moment();

var filename = (hexo.config.new_post_name || ':title')
.replace(':year', now.year())
.replace(':month', now.format('MM'))
.replace(':day', now.format('DD'))
