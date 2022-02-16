var route = hexo.route,
config = hexo.config;

module.exports = function(locals, render, callback){
if (config.exclude_generator && config.exclude_generator.indexOf('post') > -1) return callback();

var arr = locals.posts.sort('date', -1).toArray(),
length = arr.length;

arr.forEach(function(post, i){
var layout = post.layout,
path = post.path;
