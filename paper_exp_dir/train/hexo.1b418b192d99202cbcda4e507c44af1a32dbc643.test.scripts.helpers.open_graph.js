'use strict';

const moment = require('moment');

describe('open_graph', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const openGraph = require('../../../lib/plugins/helper/open_graph');
const isPost = require('../../../lib/plugins/helper/is').post;
const tag = require('hexo-util').htmlTag;
const Post = hexo.model('Post');

function meta(options) {
return tag('meta', options);
}

before(() => {
hexo.config.permalink = ':title';
return hexo.init();
});

it('default', () => {
Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(post => post.setTags(['optimize', 'web'])
.thenReturn(Post.findById(post._id))).then(post => {
openGraph.call({
page: post,
config: hexo.config,
is_post: isPost
}).should.eql([
meta({name: 'keywords', content: 'optimize,web'}),
meta({property: 'og:type', content: 'website'}),
meta({property: 'og:title', content: hexo.config.title}),
meta({property: 'og:url'}),
meta({property: 'og:site_name', content: hexo.config.title}),
meta({property: 'og:updated_time', content: post.updated.toISOString()}),
meta({name: 'twitter:card', content: 'summary'}),
meta({name: 'twitter:title', content: hexo.config.title})
].join('\n'));

return Post.removeById(post._id);
});
});

it('title - page', () => {
const ctx = {
page: {title: 'Hello world'},
config: hexo.config,
is_post: isPost
};

const result = openGraph.call(ctx);

result.should.contain(meta({property: 'og:title', content: ctx.page.title}));
});

it('title - options', () => {
const result = openGraph.call({
page: {title: 'Hello world'},
config: hexo.config,
is_post: isPost
}, {title: 'test'});

result.should.contain(meta({property: 'og:title', content: 'test'}));
});

it('type - options', () => {
const result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost
}, {type: 'photo'});

result.should.contain(meta({property: 'og:type', content: 'photo'}));
});

it('type - is_post', () => {
const result = openGraph.call({
page: {},
config: hexo.config,
is_post() {
return true;
}
});

result.should.contain(meta({property: 'og:type', content: 'article'}));
});

it('url - context', () => {
const ctx = {
page: {},
config: hexo.config,
is_post: isPost,
url: 'https://hexo.io/foo'
};

const result = openGraph.call(ctx);

result.should.contain(meta({property: 'og:url', content: ctx.url}));
});

it('url - options', () => {
const result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost,
url: 'https://hexo.io/foo'
}, {url: 'https://hexo.io/bar'});

result.should.contain(meta({property: 'og:url', content: 'https://hexo.io/bar'}));
});

it('images - content', () => {
const result = openGraph.call({
page: {
content: [
'<p>123456789</p>',
'<img src="https://hexo.io/test.jpg">'
].join('')
},
config: hexo.config,
is_post: isPost
});

result.should.contain(meta({property: 'og:image', content: 'https://hexo.io/test.jpg'}));
});

it('images - string', () => {
const result = openGraph.call({
page: {
photos: 'https://hexo.io/test.jpg'
},
config: hexo.config,
is_post: isPost
});

result.should.contain(meta({property: 'og:image', content: 'https://hexo.io/test.jpg'}));
});

it('images - array', () => {
const result = openGraph.call({
page: {
photos: [
'https://hexo.io/foo.jpg',
'https://hexo.io/bar.jpg'
