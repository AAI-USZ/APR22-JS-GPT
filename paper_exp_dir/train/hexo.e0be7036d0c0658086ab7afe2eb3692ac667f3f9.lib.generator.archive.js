var paginator = require('./paginator'),
extend = require('../extend'),
route = require('../route'),
util = require('../util'),
file = util.file,
async = require('async'),
_ = require('underscore');

extend.generator.register(function(locals, render, callback){
var posts = _.clone(locals.posts),
config = hexo.config,
mode = config.archive,
