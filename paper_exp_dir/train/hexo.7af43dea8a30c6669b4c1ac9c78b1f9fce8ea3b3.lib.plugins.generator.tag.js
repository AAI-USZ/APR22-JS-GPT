var extend = require('../../extend'),
route = require('../../route'),
paginator = require('./paginator');

extend.generator.register(function(locals, render, callback){
var config = hexo.config.tag;

if (!config){
if (config == 0 || config === false){
return callback();
} else {
config = 2;
}
}

locals.tags.each(function(tag){
var posts = tag.posts.sort('date', -1),
path = tag.path;

posts.tag = tag.name;

if (config == 2){
paginator(path, posts, 'tag', render);
} else {
render(path, ['tag', 'archive', 'index'], posts);
}
});

callback();
});
