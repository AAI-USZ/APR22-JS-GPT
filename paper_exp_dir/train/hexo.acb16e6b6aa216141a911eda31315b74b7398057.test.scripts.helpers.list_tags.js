const should = require('chai').should();
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
'<ul class="tag-list">',
'<li class="tag-list-item"><a class="tag-list-link" href="/tags/bar/">bar</a><span class="tag-list-count">1</span></li>',
'<li class="tag-list-item"><a class="tag-list-link" href="/tags/baz/">baz</a><span class="tag-list-count">2</span></li>',
'<li class="tag-list-item"><a class="tag-list-link" href="/tags/foo/">foo</a><span class="tag-list-count">1</span></li>',
'</ul>'
].join(''));
});

it('specified collection', () => {
const result = listTags(Tag.find({
