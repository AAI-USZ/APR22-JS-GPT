'use strict';

const img = require('./img');
const { encodeURL } = require('hexo-util');


module.exports = ctx => {
const PostAsset = ctx.model('PostAsset');

return function assetImgTag(args) {
const len = args.length;


for (let i = 0; i < len; i++) {
const asset = PostAsset.findOne({post: this._id, slug: args[i]});
if (asset) {
args[i] = encodeURL('/' + asset.path);
return img(ctx)(args);
}
}
};
};
