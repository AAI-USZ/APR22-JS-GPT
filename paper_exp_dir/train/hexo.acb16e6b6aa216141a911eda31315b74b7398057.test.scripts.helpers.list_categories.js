const should = require('chai').should();
const Promise = require('bluebird');

describe('list_categories', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');
const Category = hexo.model('Category');

const ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

const listCategories = require('../../../lib/plugins/helper/list_categories').bind(ctx);

before(() => hexo.init().then(() => Post.insert([
{source: 'foo', slug: 'foo'},
{source: 'bar', slug: 'bar'},
{source: 'baz', slug: 'baz'},
{source: 'boo', slug: 'boo'},
{source: 'bat', slug: 'bat'}
])).then(posts => Promise.each([
['baz'],
['baz', 'bar'],
['foo'],
['baz'],
['bat', ['baz', 'bar']]
], (cats, i) => posts[i].setCategories(cats))).then(() => {
hexo.locals.invalidate();
ctx.site = hexo.locals.toObject();
ctx.page = ctx.site.posts.data[1];
}));

it('default', () => {
const result = listCategories();

result.should.eql([
'<ul class="category-list">',
'<li class="category-list-item">',
'<a class="category-list-link" href="/categories/bat/">bat</a><span class="category-list-count">1</span>',
'</li>',
'<li class="category-list-item">',
'<a class="category-list-link" href="/categories/baz/">baz</a><span class="category-list-count">4</span>',
'<ul class="category-list-child">',
'<li class="category-list-item">',
'<a class="category-list-link" href="/categories/baz/bar/">bar</a><span class="category-list-count">2</span>',
'</li>',
'</ul>',
'</li>',
'<li class="category-list-item">',
'<a class="category-list-link" href="/categories/foo/">foo</a><span class="category-list-count">1</span>',
'</li>',
'</ul>'
].join(''));
});

it('specified collection', () => {
const result = listCategories(Category.find({
