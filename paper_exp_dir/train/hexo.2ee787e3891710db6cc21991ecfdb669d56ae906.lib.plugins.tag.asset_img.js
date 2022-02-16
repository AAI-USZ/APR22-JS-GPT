'use strict';

const url = require('url');
const img = require('./img');


module.exports = ctx => {
const PostAsset = ctx.model('PostAsset');

return function assetImgTag(args) {
let asset;
let item = '';
let i = 0;
const len = args.length;


for (; i < len; i++) {
item = args[i];
asset = PostAsset.findOne({post: this._id, slug: item});
if (asset) break;
}

if (!asset) return;

args[i] = url.resolve('/', asset.path);

return img(ctx)(args);
};
};
