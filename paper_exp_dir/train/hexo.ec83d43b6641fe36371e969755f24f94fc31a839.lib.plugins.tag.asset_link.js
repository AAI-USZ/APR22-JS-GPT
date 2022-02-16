'use strict';

const url = require('url');
const { encodeURL, escapeHTML } = require('hexo-util');


module.exports = ctx => {
const PostAsset = ctx.model('PostAsset');
const url_for = require('../../plugins/helper/url_for').bind(ctx);

return function assetLinkTag(args) {
const slug = args.shift();
if (!slug) return;

const asset = PostAsset.findOne({post: this._id, slug});
if (!asset) return;

let escape = args[args.length - 1];
