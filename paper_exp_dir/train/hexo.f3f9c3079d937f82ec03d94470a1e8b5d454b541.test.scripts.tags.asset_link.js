'use strict';

const Promise = require('bluebird');

describe('asset_link', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const assetLinkTag = require('../../../lib/plugins/tag/asset_link')(hexo);
const Post = hexo.model('Post');
const PostAsset = hexo.model('PostAsset');
let post;

hexo.config.permalink = ':title/';

function assetLink(args) {
return assetLinkTag.call(post, args.split(' '));
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
assetLink('bar').should.eql('<a href="/foo/bar" title="bar">bar</a>');
});

it('title', () => {
assetLink('bar Hello world').should.eql('<a href="/foo/bar" title="Hello world">Hello world</a>');
});

it('title with tag', () => {
assetLink('bar Hello <world>').should.eql('<a href="/foo/bar" title="Hello &lt;world&gt;">Hello &lt;world&gt;</a>');
});

it('with space', () => {

assetLinkTag.call(post, ['spaced asset', 'spaced title'])
.should.eql('<a href="/foo/spaced%20asset" title="spaced title">spaced title</a>');
});

it('no slug', () => {
should.not.exist(assetLink(''));
});

