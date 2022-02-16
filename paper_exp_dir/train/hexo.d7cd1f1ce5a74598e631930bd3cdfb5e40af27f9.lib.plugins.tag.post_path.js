'use strict';

const { encodeURL } = require('hexo-util');
const url_for = require('../helper/url_for');


module.exports = ctx => {
const Post = ctx.model('Post');

return function postPathTag(args) {
const slug = args.shift();
if (!slug) return;

const post = Post.findOne({slug});
if (!post) return;

const link = encodeURL(url_for.call(this, post.path));

return link;
};
};
