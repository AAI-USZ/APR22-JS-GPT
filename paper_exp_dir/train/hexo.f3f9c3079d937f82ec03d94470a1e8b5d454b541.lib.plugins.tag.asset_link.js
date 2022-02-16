'use strict';

const url = require('url');
const util = require('hexo-util');
const escapeHTML = util.escapeHTML;


module.exports = ctx => {
const PostAsset = ctx.model('PostAsset');

return function assetLinkTag(args) {
const slug = args.shift();
if (!slug) return;
