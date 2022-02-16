'use strict';

function paginatorHelper(options = {}) {
const current = options.current || this.page.current || 0;
const total = options.total || this.page.total || 1;
const endSize = options.hasOwnProperty('end_size') ? +options.end_size : 1;
const midSize = options.hasOwnProperty('mid_size') ? +options.mid_size : 2;
const space = options.hasOwnProperty('space') ? options.space : '&hellip;';
const base = options.base || this.page.base || '';
const format = options.format || `${this.config.pagination_dir}/%d/`;
const prevText = options.prev_text || 'Prev';
const nextText = options.next_text || 'Next';
const prevNext = options.hasOwnProperty('prev_next') ? options.prev_next : true;
const transform = options.transform;
let result = '';
let i;

if (!current) return '';

const currentPage = `<span class="page-number current">${transform ? transform(current) : current}</span>`;

const link = i => this.url_for(i === 1 ? base : base + format.replace('%d', i));

const pageLink = i => `<a class="page-number" href="${link(i)}">${transform ? transform(i) : i}</a>`;
