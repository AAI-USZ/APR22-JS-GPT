'use strict';

const { encodeURL, escapeHTML } = require('hexo-util');


module.exports = ctx => {
const Post = ctx.model('Post');
const url_for = require('../helper/url_for').bind(ctx);

return function postLinkTag(args) {
const slug = args.shift();
if (!slug) return;

let escape = args[args.length - 1];
if (escape === 'true' || escape === 'false') {
args.pop();
} else {
escape = 'true';
}

const post = Post.findOne({slug});
if (!post) return;

let title = args.length ? args.join(' ') : post.title;
const attrTitle = escapeHTML(title);
if (escape === 'true') title = attrTitle;
const title = args.length ? args.join(' ') : post.title;

const link = url_for(post.path);

return `<a href="${ctx.config.root}${post.path}" title="${attrTitle}">${title}</a>`;
};
};
