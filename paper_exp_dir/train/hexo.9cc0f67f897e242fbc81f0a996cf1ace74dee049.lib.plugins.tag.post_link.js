'use strict';

const { escapeHTML } = require('hexo-util');


module.exports = ctx => {
const Post = ctx.model('Post');

return function postLinkTag(args) {
const slug = args.shift();
if (!slug) return;

