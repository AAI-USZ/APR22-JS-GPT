'use strict';

const moment = require('moment');
const cheerio = require('cheerio');
const { encodeURL } = require('hexo-util');
const defaultConfig = require('../../../lib/hexo/default_config');

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
return hexo.init();
});

beforeEach(() => {

hexo.config = { ...defaultConfig };
hexo.config.permalink = ':title';
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



meta({property: 'article:author', content: hexo.config.author}),
meta({property: 'article:tag', content: 'optimize'}),
meta({property: 'article:tag', content: 'web'}),
meta({name: 'twitter:card', content: 'summary'})
].join('\n'));

await Post.removeById(post._id);
