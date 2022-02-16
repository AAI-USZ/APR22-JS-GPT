'use strict';

describe('post_link', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const postLink = require('../../../lib/plugins/tag/post_link')(hexo);
const Post = hexo.model('Post');

hexo.config.permalink = ':title/';

before(() => hexo.init().then(() => Post.insert([{
source: 'foo',
slug: 'foo',
title: 'Hello world'
},
{
source: 'title-with-tag',
slug: 'title-with-tag',
title: '"Hello" <new world>!'
}])));

it('default', () => {
postLink(['foo']).should.eql('<a href="/foo/" title="Hello world">Hello world</a>');
