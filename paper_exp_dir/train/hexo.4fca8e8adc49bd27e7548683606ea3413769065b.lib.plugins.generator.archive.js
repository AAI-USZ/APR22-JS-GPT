var paginator = require('./paginator'),
extend = require('../../extend'),
route = require('../../route'),
config = hexo.config,
mode = config.archive,
archiveDir = config.archive_dir + '/';

extend.generator.register(function(locals, render, callback){
if (!mode){
if (mode == 0 || mode === false){
return callback();
} else {
mode = 2;
}
}

var generate = function(path, posts){
if (mode == 2){
paginator(path, posts, 'archive', render);
} else {
route.set(path, function(fn){
render(['archive', 'index'], posts, fn);
});
}
};

var posts = locals.posts.sort('date', -1);
if (!posts.length) return callback();
posts.archive = true;

generate(archiveDir, posts);
