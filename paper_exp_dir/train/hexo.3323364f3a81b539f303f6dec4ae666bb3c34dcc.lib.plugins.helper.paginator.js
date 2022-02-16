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

var current = options.current;
var total = options.total;
var endSize = options.end_size;
var midSize = options.mid_size;
var space = options.space;
var base = options.base;
var format = options.format;
var self = this;
var front = '';
var back = '';
