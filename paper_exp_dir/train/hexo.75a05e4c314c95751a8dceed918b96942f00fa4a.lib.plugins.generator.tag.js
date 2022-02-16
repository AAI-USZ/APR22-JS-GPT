var extend = require('../../extend'),
route = require('../../route'),
paginator = require('./paginator');

extend.generator.register(function(locals, render, callback){
var config = hexo.config.tag;

if (!config) return callback();

locals.tags.each(function(tag){
var posts = tag.posts.sort('date', -1),
arr = posts.toArray(),
isUpdated = false;

for (var i=0, len=arr.length; i<len; i++){
if (arr[i].isUpdated){
isUpdated = true;
break;
}
}
