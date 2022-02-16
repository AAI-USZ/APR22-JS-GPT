'use strict';

const { htmlTag } = require('hexo-util');

const createLink = (options, ctx) => {
const { base, format } = options;

return i => ctx.url_for(i === 1 ? base : base + format.replace('%d', i));
};

const createPageTag = (options, ctx) => {
const link = createLink(options, ctx);
