'use strict';

const { content, expected } = require('../../fixtures/post_render');

describe('Render post', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Post = hexo.model('Post');
const Page = hexo.model('Page');
const renderPost = require('../../../lib/plugins/filter/before_generate/render_post').bind(hexo);

before(async () => {
await hexo.init();
await hexo.loadPlugin(require.resolve('hexo-renderer-marked'));
});

it('post', async () => {
let post = await Post.insert({
source: 'foo.md',
slug: 'foo',
_content: content
