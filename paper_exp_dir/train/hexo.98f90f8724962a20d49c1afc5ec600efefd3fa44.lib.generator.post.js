var async = require('async'),
path = require('path'),
extend = require('../extend'),
util = require('../util'),
file = util.file;

extend.generator.register(function(locals, render, callback){
var publicDir = hexo.public_dir,
linkExt = path.extname(hexo.config.permalink);

console.log('Generating posts.');

