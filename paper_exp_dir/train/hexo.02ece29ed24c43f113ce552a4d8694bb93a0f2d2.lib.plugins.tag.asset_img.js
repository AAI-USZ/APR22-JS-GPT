'use strict';

const url = require('url');
const img = require('./img');


module.exports = ctx => {
const PostAsset = ctx.model('PostAsset');

return function assetImgTag(args) {
const len = args.length;


for (let i = 0; i < len; i++) {
const asset = PostAsset.findOne({post: this._id, slug: args[i]});
if (asset) {
args[i] = url.resolve('/', asset.path);
return img(ctx)(args);
}
}
