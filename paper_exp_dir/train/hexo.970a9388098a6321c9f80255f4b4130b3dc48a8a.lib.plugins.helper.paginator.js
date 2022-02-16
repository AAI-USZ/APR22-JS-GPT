var extend = require('../../extend'),
_ = require('lodash'),
config = hexo.config;

var defaults = {
base: '/',
format: config.pagination_dir + '/%d/',
total: 1,
current: 0,
prev_text: 'Prev',
next_text: 'Next',
space: '&hellip;',
prev_next: true,
end_size: 1,
mid_size: 2,
show_all: false
};

extend.helper.register('paginator', function(options){
var options = _.extend(defaults, options),
current = options.current,
total = options.total,
end_size = options.end_size,
mid_size = options.mid_size,
space = options.space,
base = options.base,
format = options.format,
front = '',
