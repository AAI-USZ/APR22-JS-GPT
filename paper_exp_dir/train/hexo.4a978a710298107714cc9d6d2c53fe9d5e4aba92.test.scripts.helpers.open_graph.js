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
