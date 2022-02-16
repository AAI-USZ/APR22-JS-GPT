var route = hexo.route,
config = hexo.config;

module.exports = function(locals, render, callback){
if (config.exclude_generator && config.exclude_generator.indexOf('post') > -1) return callback();

var arr = locals.posts.sort('date', -1).populate('categories').populate('tags').toArray(),
length = arr.length;

arr.forEach(function(post, i){
var layout = post.layout,
path = post.path;

if (!layout || layout === 'false'){
route.set(path, function(fn){
fn(null, post.content);
});
} else {
post.prev = i === 0 ? null : arr[i - 1];
post.next = i === length - 1 ? null : arr[i + 1];

render(path, [layout, 'post', 'index'], post);
}
});

callback();
};
