'use strict';

const { encodeURL, escapeHTML } = require('hexo-util');


module.exports = ctx => {
const Post = ctx.model('Post');
const url_for = require('../../plugins/helper/url_for').bind(ctx);

return function postLinkTag(args) {
const slug = args.shift();
if (!slug) return;

let escape = args[args.length - 1];
if (escape === 'true' || escape === 'false') {
args.pop();
} else {
