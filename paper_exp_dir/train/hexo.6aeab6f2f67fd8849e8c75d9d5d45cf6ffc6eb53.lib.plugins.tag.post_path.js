'use strict';

const url_for = require('../helper/url_for');


module.exports = ctx => {
const Post = ctx.model('Post');

return function postPathTag(args) {
const slug = args.shift();
if (!slug) return;

