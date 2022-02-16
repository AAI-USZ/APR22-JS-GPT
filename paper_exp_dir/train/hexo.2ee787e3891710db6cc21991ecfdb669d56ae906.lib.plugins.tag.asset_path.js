'use strict';

const url = require('url');


module.exports = ctx => {
const PostAsset = ctx.model('PostAsset');

return function assetPathTag(args) {
const slug = args.shift();
if (!slug) return;

const asset = PostAsset.findOne({post: this._id, slug});
if (!asset) return;

return url.resolve(ctx.config.root, asset.path);
};
};
