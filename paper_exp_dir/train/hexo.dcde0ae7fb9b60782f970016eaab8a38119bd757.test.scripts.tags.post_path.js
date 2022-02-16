'use strict';

describe('post_path', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const postPath = require('../../../lib/plugins/tag/post_path')(hexo);
const Post = hexo.model('Post');

hexo.config.permalink = ':title/';

before(() => hexo.init().then(() => Post.insert([{
source: 'foo',
slug: 'foo'
}, {
source: 'fôo',
slug: 'fôo'
}])));

it('default', () => {
postPath(['foo']).should.eql('/foo/');
});

