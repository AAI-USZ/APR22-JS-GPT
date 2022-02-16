'use strict';

const { encodeURL } = require('hexo-util');


module.exports = ctx => {
const PostAsset = ctx.model('PostAsset');
const url_for = require('../../plugins/helper/url_for').bind(ctx);

return function assetPathTag(args) {
const slug = args.shift();
if (!slug) return;

const asset = PostAsset.findOne({post: this._id, slug});
if (!asset) return;

const path = encodeURL(url_for(asset.path));
