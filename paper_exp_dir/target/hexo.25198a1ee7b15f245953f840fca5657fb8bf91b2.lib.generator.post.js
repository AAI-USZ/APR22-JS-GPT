async.forEach(locals.posts.toArray(), function(item, next){
var layout = item.layout ? item.layout : 'post';

