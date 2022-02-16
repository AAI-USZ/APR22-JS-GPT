var paginator = require('./paginator'),
_ = require('lodash');

module.exports = function(locals, render, callback){
var config = hexo.config,
mode = +config.archive,
archiveDir = config.archive_dir + '/';

if (!mode) return callback();

var generate = function(path, posts, options){
if (mode === 2){
paginator(path, posts, 'archive', render, options);
} else {
render(path, ['archive', 'index'], _.extend({posts: posts}, options));
