'use strict';

const { resolve } = require('url');
const { encodeURL } = require('hexo-util');


module.exports = ctx => {
const PostAsset = ctx.model('PostAsset');

return function assetPathTag(args) {
const slug = args.shift();
if (!slug) return;

