'use strict';

const { htmlTag } = require('hexo-util');

const createLink = (options, ctx) => {
const { base, format } = options;

return i => ctx.url_for(i === 1 ? base : base + format.replace('%d', i));
};

const createPageTag = (options, ctx) => {
const link = createLink(options, ctx);
const { current, transform } = options;

return i => {
if (i === current) {
return htmlTag('span', { class: 'page-number current' }, transform ? transform(i) : i);
}
return htmlTag('a', { class: 'page-number', href: link(i) }, transform ? transform(i) : i);
};
};

const showAll = (tags, options, ctx) => {
const { total } = options;

const pageLink = createPageTag(options, ctx);

for (let i = 1; i <= total; i++) {
tags.push(pageLink(i));
}
};

