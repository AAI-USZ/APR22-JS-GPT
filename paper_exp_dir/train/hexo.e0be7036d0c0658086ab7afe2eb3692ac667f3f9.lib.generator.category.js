var paginator = require('./paginator'),
extend = require('../extend'),
route = require('../route'),
util = require('../util'),
file = util.file,
async = require('async');

extend.generator.register(function(locals, render, callback){
var config = hexo.config.category,
publicDir = hexo.public_dir;

if (!config) return callback();
