var paginator = require('./paginator'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
async = require('async'),
_ = require('underscore');

extend.generate.register(function(locals, render, callback){
var posts = locals.posts,
config = hexo.config,
publicDir = hexo.public_dir;

