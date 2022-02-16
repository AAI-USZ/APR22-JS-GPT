var _ = require('lodash');

module.exports = function(options){
options = _.extend({
base: this.page.base,
format: this.config.pagination_dir + '/%d/',
total: this.page.total || 1,
current: this.page.current || 0,
prev_text: 'Prev',
next_text: 'Next',
space: '&hellip;',
prev_next: true,
end_size: 1,
mid_size: 2,
show_all: false
}, options);

var current = options.current,
total = options.total,
endSize = options.end_size,
midSize = options.mid_size,
space = options.space,
base = options.base,
format = options.format,
i;

var front = '',
back = '';

var link = function(i){
return i == 1 ? base : base + format.replace('%d', i);
};
