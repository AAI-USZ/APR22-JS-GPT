'use strict';

const Promise = require('bluebird');

describe('asset_img', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const assetImgTag = require('../../../lib/plugins/tag/asset_img')(hexo);
const Post = hexo.model('Post');
const PostAsset = hexo.model('PostAsset');
let post;

hexo.config.permalink = ':title/';

function assetImg(args) {
return assetImgTag.call(post, args.split(' '));
}

before(() => hexo.init().then(() => Post.insert({
source: 'foo.md',
slug: 'foo'
})).then(post_ => {
post = post_;

return Promise.all([
PostAsset.insert({
_id: 'bar',
slug: 'bar',
post: post._id
}),
PostAsset.insert({
_id: 'bár',
slug: 'bár',
post: post._id
}),
PostAsset.insert({
_id: 'spaced asset',
slug: 'spaced asset',
post: post._id
})
]);
}));
