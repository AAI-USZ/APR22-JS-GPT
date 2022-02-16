'use strict';

const Promise = require('bluebird');

describe('tagcloud', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');
const Tag = hexo.model('Tag');

const ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

const tagcloud = require('../../../lib/plugins/helper/tagcloud').bind(ctx);

before(async () => {
await hexo.init();
const posts = await Post.insert([
{source: 'foo', slug: 'foo'},
{source: 'bar', slug: 'bar'},
{source: 'baz', slug: 'baz'},
{source: 'boo', slug: 'boo'}
]);

await Promise.all([
