var should = require('chai').should();
var Promise = require('bluebird');

describe('asset_img', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var assetImgTag = require('../../../lib/plugins/tag/asset_img')(hexo);
var Post = hexo.model('Post');
var PostAsset = hexo.model('PostAsset');
var post;

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
_id: 'spaced asset',
slug: 'spaced asset',
post: post._id
})
]);
}));

it('default', () => {
assetImg('bar').should.eql('<img src="/foo/bar">');
});

it('default', () => {
assetImg('bar title').should.eql('<img src="/foo/bar" title="title">');
});

it('with space', () => {

assetImgTag.call(post, ['spaced asset', 'spaced title'])
.should.eql('<img src="/foo/spaced%20asset" title="spaced title">');
});

it('with alt and title', () => {
assetImgTag.call(post, ['bar', '"title"', '"alt"'])
.should.eql('<img src="/foo/bar" title="title" alt="alt">');
});

it('with width height alt and title', () => {
assetImgTag.call(post, ['bar', '100', '200', '"title"', '"alt"'])
