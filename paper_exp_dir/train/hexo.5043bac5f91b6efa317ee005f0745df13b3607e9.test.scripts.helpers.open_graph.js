'use strict';

const moment = require('moment');
const cheerio = require('cheerio');

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
meta({property: 'og:locale', content: 'en'}),
meta({property: 'og:updated_time', content: post.updated.toISOString()}),
meta({name: 'twitter:card', content: 'summary'})
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

it('url - should not ends with index.html', () => {
hexo.config.pretty_urls.trailing_index = false;
const result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost,
url: 'http://yoursite.com/page/index.html'
});

const $ = cheerio.load(result);

$('meta[property="og:url"]').attr('content').endsWith('index.html').should.be.false;

hexo.config.pretty_urls.trailing_index = true;
});

it('url - IDN', () => {
const ctx = {
page: {},
config: hexo.config,
is_post: isPost,
url: 'https://foô.com/bár'
};

const result = openGraph.call(ctx);

