var moment = require('moment'),
clc = require('cli-color'),
extend = require('../extend'),
util = require('../util'),
file = util.file;

extend.console.register('new_post', 'Create a new post', function(args){
var slug = args[0];

if (slug === undefined){
console.log('Usage: hexo new_post <title>');
return false;
