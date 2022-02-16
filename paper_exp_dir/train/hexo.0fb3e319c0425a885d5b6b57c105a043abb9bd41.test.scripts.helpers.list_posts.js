'use strict';

describe('list_posts', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');

const ctx = {
config: hexo.config
};

const listPosts = require('../../../lib/plugins/helper/list_posts').bind(ctx);

hexo.config.permalink = ':title/';

before(async () => {
await hexo.init();
await Post.insert([
{source: 'foo', slug: 'foo', title: 'Its', date: 1e8},
{source: 'bar', slug: 'bar', title: 'Chemistry', date: 1e8 + 1},
{source: 'baz', slug: 'baz', title: 'Bitch', date: 1e8 - 1}
]);

