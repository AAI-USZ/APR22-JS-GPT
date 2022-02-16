var moment = require('moment');
var should = require('chai').should();

describe('open_graph', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var openGraph = require('../../../lib/plugins/helper/open_graph');
var isPost = require('../../../lib/plugins/helper/is').post;
var tag = require('hexo-util').htmlTag;
var Post = hexo.model('Post');

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
var ctx = {
page: {title: 'Hello world'},
config: hexo.config,
is_post: isPost
};

var result = openGraph.call(ctx);

result.should.contain(meta({property: 'og:title', content: ctx.page.title}));
});

it('title - options', () => {
var result = openGraph.call({
page: {title: 'Hello world'},
config: hexo.config,
is_post: isPost
}, {title: 'test'});

result.should.contain(meta({property: 'og:title', content: 'test'}));
});

it('type - options', () => {
var result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost
}, {type: 'photo'});

result.should.contain(meta({property: 'og:type', content: 'photo'}));
});

it('type - is_post', () => {
var result = openGraph.call({
page: {},
config: hexo.config,
is_post() {
return true;
}
});

result.should.contain(meta({property: 'og:type', content: 'article'}));
});

it('url - context', () => {
var ctx = {
page: {},
config: hexo.config,
is_post: isPost,
url: 'http://hexo.io/foo'
};

var result = openGraph.call(ctx);

result.should.contain(meta({property: 'og:url', content: ctx.url}));
});

it('url - options', () => {
var result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost,
url: 'http://hexo.io/foo'
}, {url: 'http://hexo.io/bar'});

result.should.contain(meta({property: 'og:url', content: 'http://hexo.io/bar'}));
});

it('images - content', () => {
var result = openGraph.call({
page: {
content: [
'<p>123456789</p>',
'<img src="http://hexo.io/test.jpg">'
].join('')
},
config: hexo.config,
is_post: isPost
});

result.should.contain(meta({property: 'og:image', content: 'http://hexo.io/test.jpg'}));
});

it('images - string', () => {
var result = openGraph.call({
page: {
photos: 'http://hexo.io/test.jpg'
},
config: hexo.config,
is_post: isPost
});

result.should.contain(meta({property: 'og:image', content: 'http://hexo.io/test.jpg'}));
});

it('images - array', () => {
var result = openGraph.call({
page: {
photos: [
'http://hexo.io/foo.jpg',
'http://hexo.io/bar.jpg'
]
},
config: hexo.config,
is_post: isPost
});

result.should.contain([
meta({property: 'og:image', content: 'http://hexo.io/foo.jpg'}),
meta({property: 'og:image', content: 'http://hexo.io/bar.jpg'})
].join('\n'));
});

it('images - don\'t pollute context', () => {
var ctx = {
page: {
content: [
'<p>123456789</p>',
'<img src="http://hexo.io/test.jpg">'
].join(''),
photos: []
},
config: hexo.config,
is_post: isPost
};

openGraph.call(ctx);
ctx.page.photos.should.eql([]);
});

it('images - options.image', () => {
var result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost
}, {image: 'http://hexo.io/test.jpg'});

result.should.contain(meta({property: 'og:image', content: 'http://hexo.io/test.jpg'}));
});

it('images - options.images', () => {
var result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost
}, {images: 'http://hexo.io/test.jpg'});

result.should.contain(meta({property: 'og:image', content: 'http://hexo.io/test.jpg'}));
});

it('images - prepend config.url to the path (without prefixing /)', () => {
var result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost
}, {images: 'test.jpg'});

result.should.contain(meta({property: 'og:image', content: hexo.config.url + '/test.jpg'}));
});

it('images - prepend config.url to the path (with prefixing /)', () => {
var result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost
}, {images: '/test.jpg'});

result.should.contain(meta({property: 'og:image', content: hexo.config.url + '/test.jpg'}));
});

it('images - resolve relative path when site is hosted in subdirectory', () => {
var urlFn = require('url');
var config = hexo.config;
config.url = urlFn.resolve(config.url, 'blog');
config.root = 'blog';
var postUrl = urlFn.resolve(config.url, '/foo/bar/index.html');

var result = openGraph.call({
page: {},
config,
is_post: isPost,
url: postUrl
}, {images: 'test.jpg'});

result.should.contain(meta({property: 'og:image', content: urlFn.resolve(config.url, '/foo/bar/test.jpg')}));
});

it('site_name - options', () => {
var result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost
}, {site_name: 'foo'});

result.should.contain(meta({property: 'og:site_name', content: 'foo'}));
});

it('description - truncate meta description to 160 characters', () => {
var ctx = {

page: {description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbb'},
config: hexo.config,
is_post: isPost
};

var result = openGraph.call(ctx);

result.match('<meta name="description"[^>]+content="([^")]*)"')[1].length.should.be.at.most(160);
