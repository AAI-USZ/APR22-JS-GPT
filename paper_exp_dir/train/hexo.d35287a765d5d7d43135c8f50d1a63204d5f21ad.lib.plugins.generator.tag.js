var _ = require('lodash'),
paginator = require('./paginator');

module.exports = function(locals, render, callback){
var config = hexo.config;

if (config.exclude_generator && config.exclude_generator.indexOf('tag') > -1) return callback();

var mode = +config.tag;

if (!mode) return callback();

locals.tags.populate('posts').each(function(tag){
if (!tag.length) return;

var posts = tag.posts.sort('date', -1).populate('categories').populate('tags'),
path = tag.path;

if (mode === 2){
paginator(path, posts, 'tag', render, {tag: tag.name});
