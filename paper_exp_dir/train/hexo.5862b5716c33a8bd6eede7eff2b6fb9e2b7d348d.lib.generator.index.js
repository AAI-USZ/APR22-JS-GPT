var _ = require('underscore'),
config = hexo.config.exclude_generator,
generator = ['home', 'post', 'page', 'category', 'tag', 'archive'];

if (!config){
config = [];
