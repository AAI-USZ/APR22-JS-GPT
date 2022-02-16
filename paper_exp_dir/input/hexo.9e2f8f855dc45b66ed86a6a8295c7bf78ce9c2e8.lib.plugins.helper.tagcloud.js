var extend = require('../../extend'),
_ = require('lodash'),
config = hexo.config,
root = config.root;

extend.helper.register('tagcloud', function(tags, options){
