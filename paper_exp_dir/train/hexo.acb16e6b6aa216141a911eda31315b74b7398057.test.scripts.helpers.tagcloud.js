const should = require('chai').should();
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
