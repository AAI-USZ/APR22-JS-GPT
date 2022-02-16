var paginator = require('./paginator'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
async = require('async');

extend.generate.register(function(locals, render, callback){
var config = hexo.config.tag,
tags = locals.tags,
publicDir = hexo.public_dir;

if (!config) return callback();
