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

before(() => hexo.init().then(() => Post.insert([
{source: 'foo', slug: 'foo'},
{source: 'bar', slug: 'bar'},
{source: 'baz', slug: 'baz'},
{source: 'boo', slug: 'boo'}
])).then(posts =>
Promise.each([
['bcd'],
['bcd', 'cde'],
['bcd', 'cde', 'abc'],
['bcd', 'cde', 'abc', 'def']
], (tags, i) => posts[i].setTags(tags))).then(() => {
hexo.locals.invalidate();
ctx.site = hexo.locals.toObject();
}));

it('default', () => {
const result = tagcloud();

result.should.eql([
'<a href="/tags/abc/" style="font-size: 13.33px;">abc</a>',
'<a href="/tags/bcd/" style="font-size: 20px;">bcd</a>',
'<a href="/tags/cde/" style="font-size: 16.67px;">cde</a>',
'<a href="/tags/def/" style="font-size: 10px;">def</a>'
].join(' '));
});

it('specified collection', () => {
const result = tagcloud(Tag.find({
name: /bc/
}));

result.should.eql([
'<a href="/tags/abc/" style="font-size: 10px;">abc</a>',
'<a href="/tags/bcd/" style="font-size: 20px;">bcd</a>'
].join(' '));
});

it('font size', () => {
const result = tagcloud({
min_font: 15,
max_font: 30
});

result.should.eql([
'<a href="/tags/abc/" style="font-size: 20px;">abc</a>',
'<a href="/tags/bcd/" style="font-size: 30px;">bcd</a>',
'<a href="/tags/cde/" style="font-size: 25px;">cde</a>',
'<a href="/tags/def/" style="font-size: 15px;">def</a>'
].join(' '));
});

it('font size - when every tag has the same number of posts, font-size should be minimum.', () => {
const result = tagcloud(Tag.find({
name: /abc/
}), {
min_font: 15,
max_font: 30
});

result.should.eql([
'<a href="/tags/abc/" style="font-size: 15px;">abc</a>'
].join(' '));
});

it('font unit', () => {
const result = tagcloud({
unit: 'em'
});

result.should.eql([
'<a href="/tags/abc/" style="font-size: 13.33em;">abc</a>',
'<a href="/tags/bcd/" style="font-size: 20em;">bcd</a>',
'<a href="/tags/cde/" style="font-size: 16.67em;">cde</a>',
'<a href="/tags/def/" style="font-size: 10em;">def</a>'
].join(' '));
});

it('orderby - length', () => {
const result = tagcloud({
orderby: 'length'
});

result.should.eql([
'<a href="/tags/def/" style="font-size: 10px;">def</a>',
'<a href="/tags/abc/" style="font-size: 13.33px;">abc</a>',
'<a href="/tags/cde/" style="font-size: 16.67px;">cde</a>',
'<a href="/tags/bcd/" style="font-size: 20px;">bcd</a>'
].join(' '));
});

it('orderby - random', () => {
const result1 = tagcloud({
orderby: 'random'
});

const result2 = tagcloud({
orderby: 'rand'
});

result1.should.contains('<a href="/tags/def/" style="font-size: 10px;">def</a>');
result1.should.contains('<a href="/tags/abc/" style="font-size: 13.33px;">abc</a>');
