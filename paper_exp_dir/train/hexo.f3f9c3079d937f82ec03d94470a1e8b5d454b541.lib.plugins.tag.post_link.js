'use strict';

const util = require('hexo-util');
const escapeHTML = util.escapeHTML;


module.exports = ctx => {
const Post = ctx.model('Post');

return function postLinkTag(args) {
const slug = args.shift();
if (!slug) return;

const post = Post.findOne({slug});
