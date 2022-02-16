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
meta({property: 'og:locale', content: 'en'}),
meta({property: 'og:updated_time', content: post.updated.toISOString()}),
meta({name: 'twitter:card', content: 'summary'}),
meta({name: 'twitter:title', content: hexo.config.title})
].join('\n'));

return Post.removeById(post._id);
});
});

it('title - page', () => {
