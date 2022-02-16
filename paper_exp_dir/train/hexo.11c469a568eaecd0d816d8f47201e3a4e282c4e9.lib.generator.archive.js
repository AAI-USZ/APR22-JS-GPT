var paginator = require('./paginator'),
extend = require('../extend'),
route = require('../route'),
_ = require('underscore');

extend.generator.register(function(locals, render, callback){
var posts = locals.posts,
config = hexo.config,
mode = config.archive,
archiveDir = config.archive_dir + '/';

if (!config) return callback();

