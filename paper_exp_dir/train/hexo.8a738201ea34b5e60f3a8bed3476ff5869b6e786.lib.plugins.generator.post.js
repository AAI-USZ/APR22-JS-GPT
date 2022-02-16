module.exports = function(locals, render, callback){
var route = hexo.route,
arr = locals.posts.sort('date', -1).toArray(),
length = arr.length;

arr.forEach(function(post, i){
var layout = post.layout,
path = post.path;

if (!layout || layout === 'false'){
route.set(path, function(fn){
fn(null, post.content);
