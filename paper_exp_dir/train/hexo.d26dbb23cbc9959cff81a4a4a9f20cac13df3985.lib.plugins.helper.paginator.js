'use strict';

const createLink = (options, ctx) => {
const { base, format } = options;

return i => ctx.url_for(i === 1 ? base : base + format.replace('%d', i));
};

function paginatorHelper(options = {}) {
options = Object.assign({
base: this.page.base || '',
current: this.page.current || 0,
