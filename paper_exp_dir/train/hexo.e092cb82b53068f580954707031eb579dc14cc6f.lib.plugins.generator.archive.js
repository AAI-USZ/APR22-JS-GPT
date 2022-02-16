var paginator = require('./paginator'),
extend = require('../../extend'),
route = require('../../route'),
_ = require('underscore'),
config = hexo.config,
mode = config.archive,
archiveDir = config.archive_dir + '/';

extend.generator.register(function(locals, render, callback){
if (!mode) return callback();

var posts = locals.posts.sort('date', -1),
arr = posts.toArray(),
latest = true;

if (!arr.length) return callback();

for (var i=0, len=arr.length; i<len; i++){
if (!arr[i]._latest){
latest = false;
break;
}
}

if (latest && !hexo.cache.rebuild) return callback();

