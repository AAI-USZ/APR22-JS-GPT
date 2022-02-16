'use strict';

const { htmlTag, url_for } = require('hexo-util');

const createLink = (options, ctx) => {
const { base, format } = options;

return i => url_for.call(ctx, i === 1 ? base : base + format.replace('%d', i));
};

const createPageTag = (options, ctx) => {
const link = createLink(options, ctx);
const { current, escape, transform } = options;

return i => {
if (i === current) {
return htmlTag('span', { class: 'page-number current' }, transform ? transform(i) : i, escape);
}
return htmlTag('a', { class: 'page-number', href: link(i) }, transform ? transform(i) : i, escape);
};
};

const showAll = (tags, options, ctx) => {
const { total } = options;

const pageLink = createPageTag(options, ctx);

for (let i = 1; i <= total; i++) {
tags.push(pageLink(i));
}
};

const pagenasionPartShow = (tags, options, ctx) => {
const {
current,
total,
space,
end_size: endSize,
mid_size: midSize
} = options;

const leftEnd = Math.min(endSize, current - 1);
