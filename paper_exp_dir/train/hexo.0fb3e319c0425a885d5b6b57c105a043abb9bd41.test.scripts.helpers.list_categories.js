'use strict';

describe('list_categories', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');
const Category = hexo.model('Category');

const ctx = {
config: hexo.config
};

const listCategories = require('../../../lib/plugins/helper/list_categories').bind(ctx);

before(async () => {
await hexo.init();
const posts = await Post.insert([
{source: 'foo', slug: 'foo'},
{source: 'bar', slug: 'bar'},
{source: 'baz', slug: 'baz'},
{source: 'boo', slug: 'boo'},
{source: 'bat', slug: 'bat'}
]);
