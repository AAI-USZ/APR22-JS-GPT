'use strict';

function paginatorHelper(options = {}) {
options = Object.assign({
base: this.page.base || '',
current: this.page.current || 0,
format: `${this.config.pagination_dir}/%d/`,
total: this.page.total || 1,
end_size: 1,
mid_size: 2,
space: '&hellip;',
next_text: 'Next',
prev_text: 'Prev',
prev_next: true
}, options);

const {
base,
current,
format,
total,
space,
transform,
end_size: endSize,
mid_size: midSize,
prev_text: prevText,
