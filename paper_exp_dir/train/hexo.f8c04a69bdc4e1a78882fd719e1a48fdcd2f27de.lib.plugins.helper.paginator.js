var extend = require('../../extend'),
_ = require('lodash'),
config = hexo.config;

extend.helper.register('paginator', function(options){
var defaults = {
base: '/',
format: config.pagination_dir + '/%d/',
total: 1,
current: 0,
prev_text: 'Prev',
next_text: 'Next',
space: '&hellip;',
prev_next: true,
