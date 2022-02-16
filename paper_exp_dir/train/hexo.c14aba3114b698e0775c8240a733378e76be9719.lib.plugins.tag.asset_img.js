'use strict';

var url = require('url');
var img = require('./img');


module.exports = function(ctx) {
var PostAsset = ctx.model('PostAsset');

return function assetImgTag(args) {
var asset;
var item = '';
var i = 0;
var len = args.length;


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
