var extend = require('../extend'),
_ = require('underscore'),
config = hexo.config;

var defaults = {
base: '/',
format: config.pagination_dir + '/%d/',
total: 1,
current: 0,
prev_text: 'Prev',
next_text: 'Next',
