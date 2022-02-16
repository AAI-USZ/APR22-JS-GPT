'use strict';

const Promise = require('bluebird');

describe('list_tags', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');
const Tag = hexo.model('Tag');

const ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

const listTags = require('../../../lib/plugins/helper/list_tags').bind(ctx);

before(() => hexo.init().then(() => Post.insert([
{source: 'foo', slug: 'foo'},
{source: 'bar', slug: 'bar'},
{source: 'baz', slug: 'baz'},
{source: 'boo', slug: 'boo'}
])).then(posts =>
Promise.each([
['foo'],
['baz'],
['baz'],
['bar']
], (tags, i) => posts[i].setTags(tags))).then(() => {
hexo.locals.invalidate();
ctx.site = hexo.locals.toObject();
}));

it('default', () => {
const result = listTags();

result.should.eql([
'<ul class="tag-list" itemprop="keywords">',
'<li class="tag-list-item"><a class="tag-list-link" href="/tags/bar/" rel="tag">bar</a><span class="tag-list-count">1</span></li>',
'<li class="tag-list-item"><a class="tag-list-link" href="/tags/baz/" rel="tag">baz</a><span class="tag-list-count">2</span></li>',
'<li class="tag-list-item"><a class="tag-list-link" href="/tags/foo/" rel="tag">foo</a><span class="tag-list-count">1</span></li>',
'</ul>'
].join(''));
});

it('specified collection', () => {
const result = listTags(Tag.find({
name: /^b/
}));

result.should.eql([
'<ul class="tag-list" itemprop="keywords">',
'<li class="tag-list-item"><a class="tag-list-link" href="/tags/bar/" rel="tag">bar</a><span class="tag-list-count">1</span></li>',
'<li class="tag-list-item"><a class="tag-list-link" href="/tags/baz/" rel="tag">baz</a><span class="tag-list-count">2</span></li>',
'</ul>'
].join(''));
});

it('style: false', () => {
const result = listTags({
style: false
});

result.should.eql([
'<a class="tag-link" href="/tags/bar/" rel="tag">bar<span class="tag-count">1</span></a>',
'<a class="tag-link" href="/tags/baz/" rel="tag">baz<span class="tag-count">2</span></a>',
'<a class="tag-link" href="/tags/foo/" rel="tag">foo<span class="tag-count">1</span></a>'
