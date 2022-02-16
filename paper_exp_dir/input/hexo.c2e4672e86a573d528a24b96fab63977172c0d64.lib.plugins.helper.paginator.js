'use strict';

function paginatorHelper(options = {}) {
const current = options.current || this.page.current || 0;
const total = options.total || this.page.total || 1;
const { space = '&hellip;', transform } = options;
const base = options.base || this.page.base || '';
const format = options.format || `${this.config.pagination_dir}/%d/`;
const prevText = options.prev_text || 'Prev';
const nextText = options.next_text || 'Next';
