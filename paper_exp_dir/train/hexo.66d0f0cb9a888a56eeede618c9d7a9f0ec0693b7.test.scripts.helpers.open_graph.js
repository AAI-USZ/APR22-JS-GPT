'use strict';

const moment = require('moment');
const cheerio = require('cheerio');
const { encodeURL } = require('hexo-util');

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

it('default', async () => {
let post = await Post.insert({
source: 'foo.md',
slug: 'bar'
});
await post.setTags(['optimize', 'web']);

post = await Post.findById(post._id);

const result = openGraph.call({
page: post,
config: hexo.config,
is_post: isPost
});

result.should.eql([
meta({property: 'og:type', content: 'website'}),
meta({property: 'og:title', content: hexo.config.title}),
meta({property: 'og:url'}),
meta({property: 'og:site_name', content: hexo.config.title}),
meta({property: 'og:locale', content: 'en_US'}),
meta({property: 'article:published_time', content: post.date.toISOString()}),
meta({property: 'article:modified_time', content: post.updated.toISOString()}),
meta({property: 'article:author', content: hexo.config.author}),
meta({property: 'article:tag', content: 'optimize'}),
meta({property: 'article:tag', content: 'web'}),
meta({name: 'twitter:card', content: 'summary'})
].join('\n'));

await Post.removeById(post._id);
});

it('title - page', () => {
const ctx = {
page: {title: 'Hello world'},
config: hexo.config,
is_post: isPost
};

const result = openGraph.call(ctx);

result.should.to.have.string(meta({property: 'og:title', content: ctx.page.title}));
});

it('title - options', () => {
const result = openGraph.call({
page: {title: 'Hello world'},
config: hexo.config,
is_post: isPost
}, {title: 'test'});

result.should.to.have.string(meta({property: 'og:title', content: 'test'}));
});

it('type - options', () => {
const result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost
}, {type: 'photo'});

result.should.to.have.string(meta({property: 'og:type', content: 'photo'}));
});

it('type - is_post', () => {
const result = openGraph.call({
page: {},
config: hexo.config,
is_post() {
return true;
}
});

result.should.to.have.string(meta({property: 'og:type', content: 'article'}));
});

it('url - context', () => {
const ctx = {
page: {},
config: hexo.config,
is_post: isPost,
url: 'https://hexo.io/foo'
};

const result = openGraph.call(ctx);

result.should.to.have.string(meta({property: 'og:url', content: ctx.url}));
});

it('url - options', () => {
const result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost,
url: 'https://hexo.io/foo'
}, {url: 'https://hexo.io/bar'});

result.should.to.have.string(meta({property: 'og:url', content: 'https://hexo.io/bar'}));
});

it('url - pretty_urls.trailing_index', () => {
hexo.config.pretty_urls.trailing_index = false;
const result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost,
url: 'http://yoursite.com/page/index.html'
});

const $ = cheerio.load(result);

$('meta[property="og:url"]').attr('content').endsWith('index.html').should.eql(false);

hexo.config.pretty_urls.trailing_index = true;
});

it('url - pretty_urls.trailing_html', () => {
hexo.config.pretty_urls.trailing_html = false;
const result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost,
url: 'http://yoursite.com/page/about.html'
});

const $ = cheerio.load(result);

$('meta[property="og:url"]').attr('content').endsWith('.html').should.eql(false);

hexo.config.pretty_urls.trailing_html = true;
});

it('url - null pretty_urls', () => {
hexo.config.pretty_urls = null;
const url = 'http://yoursite.com/page/about.html';
const result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost,
url
});

const $ = cheerio.load(result);

$('meta[property="og:url"]').attr('content').should.eql(url);

hexo.config.pretty_urls = {
trailing_index: true,
trailing_html: true
};
});

it('url - IDN', () => {
const ctx = {
page: {},
config: hexo.config,
is_post: isPost,
url: 'https://foô.com/bár'
};

const result = openGraph.call(ctx);

result.should.to.have.string(meta({property: 'og:url', content: encodeURL(ctx.url)}));
});

it('images - content', () => {
const result = openGraph.call({
page: {
content: [
'<p>123456789</p>',
'<img src="https://hexo.io/test.jpg">',
'<img src="">',
'<img class="img">'
].join('')
},
config: hexo.config,
is_post: isPost
});

result.should.to.have.string(meta({property: 'og:image', content: 'https://hexo.io/test.jpg'}));
});

it('images - string', () => {
const result = openGraph.call({
page: {
photos: 'https://hexo.io/test.jpg'
},
config: hexo.config,
is_post: isPost
});

result.should.to.have.string(meta({property: 'og:image', content: 'https://hexo.io/test.jpg'}));
});

it('images - array', () => {
const result = openGraph.call({
page: {
photos: [
'https://hexo.io/foo.jpg',
'https://hexo.io/bar.jpg'
]
},
config: hexo.config,
is_post: isPost
});

result.should.to.have.string([
