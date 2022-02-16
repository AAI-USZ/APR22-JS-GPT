'use strict';

const Promise = require('bluebird');

describe('asset_path', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const assetPathTag = require('../../../lib/plugins/tag/asset_path')(hexo);
const Post = hexo.model('Post');
const PostAsset = hexo.model('PostAsset');
let post;

hexo.config.permalink = ':title/';

function assetPath(args) {
return assetPathTag.call(post, args.split(' '));
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
post: post._id
