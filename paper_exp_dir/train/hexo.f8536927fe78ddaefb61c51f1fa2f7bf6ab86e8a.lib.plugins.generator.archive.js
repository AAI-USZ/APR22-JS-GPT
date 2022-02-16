var paginator = require('./paginator'),
extend = require('../../extend'),
route = require('../../route'),
config = hexo.config,
mode = config.archive,
archiveDir = config.archive_dir + '/';

extend.generator.register(function(locals, render, callback){
if (!mode) return callback();

var posts = locals.posts.sort('date', -1),
arr = posts.toArray(),
latest = true;
