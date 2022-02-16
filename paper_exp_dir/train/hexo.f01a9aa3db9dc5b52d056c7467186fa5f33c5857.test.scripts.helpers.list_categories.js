'use strict';

var should = require('chai').should();
var Promise = require('bluebird');

describe('list_categories', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Post = hexo.model('Post');
var Category = hexo.model('Category');

var ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

var listCategories = require('../../../lib/plugins/helper/list_categories').bind(ctx);

before(function() {
return Post.insert([
{source: 'foo', slug: 'foo'},
{source: 'bar', slug: 'bar'},
{source: 'baz', slug: 'baz'},
{source: 'boo', slug: 'boo'}
]).then(function(posts) {
return Promise.each([
['baz'],
['baz', 'bar'],
['foo'],
['baz']
], function(cats, i) {
return posts[i].setCategories(cats);
});
}).then(function() {
hexo.locals.invalidate();
ctx.site = hexo.locals.toObject();
ctx.page = ctx.site.posts.data[1];
});
});

it('default', function() {
var result = listCategories();

result.should.eql([
'<ul class="category-list">',
'<li class="category-list-item">',
'<a class="category-list-link" href="/categories/baz/">baz</a><span class="category-list-count">3</span>',
'<ul class="category-list-child">',
'<li class="category-list-item">',
'<a class="category-list-link" href="/categories/baz/bar/">bar</a><span class="category-list-count">1</span>',
'</li>',
'</ul>',
'</li>',
'<li class="category-list-item">',
'<a class="category-list-link" href="/categories/foo/">foo</a><span class="category-list-count">1</span>',
'</li>',
'</ul>'
].join(''));
});

it('specified collection', function() {
var result = listCategories(Category.find({
parent: {$exists: false}
}));

result.should.eql([
'<ul class="category-list">',
'<li class="category-list-item">',
'<a class="category-list-link" href="/categories/baz/">baz</a><span class="category-list-count">3</span>',
'</li>',
'<li class="category-list-item">',
'<a class="category-list-link" href="/categories/foo/">foo</a><span class="category-list-count">1</span>',
'</li>',
'</ul>'
].join(''));
});

it('style: false', function() {
var result = listCategories({
style: false
});

result.should.eql([
'<a class="category-link" href="/categories/baz/">baz<span class="category-count">3</span></a>',
'<a class="category-link" href="/categories/baz/bar/">bar<span class="category-count">1</span></a>',
'<a class="category-link" href="/categories/foo/">foo<span class="category-count">1</span></a>'
].join(', '));
});

it('show_count: false', function() {
var result = listCategories({
show_count: false
});

result.should.eql([
'<ul class="category-list">',
'<li class="category-list-item">',
'<a class="category-list-link" href="/categories/baz/">baz</a>',
'<ul class="category-list-child">',
'<li class="category-list-item">',
'<a class="category-list-link" href="/categories/baz/bar/">bar</a>',
'</li>',
'</ul>',
'</li>',
'<li class="category-list-item">',
'<a class="category-list-link" href="/categories/foo/">foo</a>',
'</li>',
'</ul>'
].join(''));
});

it('class', function() {
