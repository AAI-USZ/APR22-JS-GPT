'use strict';

const { encodeURL } = require('hexo-util');


module.exports = ctx => {
const Post = ctx.model('Post');

return function postPathTag(args) {
const slug = args.shift();
if (!slug) return;

