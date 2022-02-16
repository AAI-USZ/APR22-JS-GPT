'use strict';

const { encodeURL, escapeHTML } = require('hexo-util');
const { resolve } = require('url');


module.exports = ctx => {
const Post = ctx.model('Post');

return function postLinkTag(args) {
const slug = args.shift();
const error = `<a href="#">Post not found: ${args.join(' ') || 'Invalid post_link'}</a>`;
if (!slug) return error;

let escape = args[args.length - 1];
if (escape === 'true' || escape === 'false') {
args.pop();
} else {
escape = 'true';
}

