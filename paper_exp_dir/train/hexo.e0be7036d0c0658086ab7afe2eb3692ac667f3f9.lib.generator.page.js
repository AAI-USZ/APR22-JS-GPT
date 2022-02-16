var async = require('async'),
route = require('../route'),
util = require('../util'),
extend = require('../extend'),
file = util.file;

extend.generator.register(function(locals, render, callback){
var publicDir = hexo.public_dir;

console.log('Generating pages.');

