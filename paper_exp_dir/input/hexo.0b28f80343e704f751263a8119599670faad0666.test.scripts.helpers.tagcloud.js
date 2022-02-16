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
['bcd'],
['bcd', 'cde'],
['bcd', 'cde', 'abc'],
['bcd', 'cde', 'abc', 'def']
].map((tags, i) => posts[i].setTags(tags)));

hexo.locals.invalidate();
ctx.site = hexo.locals.toObject();
});

it('default', () => {
const result = tagcloud();

result.should.eql([
'<a href="/tags/abc/" style="font-size: 13.33px;">abc</a>',
'<a href="/tags/bcd/" style="font-size: 20px;">bcd</a>',
'<a href="/tags/cde/" style="font-size: 16.67px;">cde</a>',
'<a href="/tags/def/" style="font-size: 10px;">def</a>'
].join(' '));
});

