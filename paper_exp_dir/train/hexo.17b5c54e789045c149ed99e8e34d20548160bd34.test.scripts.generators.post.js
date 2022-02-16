'use strict';

const Promise = require('bluebird');

describe('post', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname, {silent: true});
const Post = hexo.model('Post');
const generator = Promise.method(require('../../../lib/plugins/generator/post').bind(hexo));

hexo.config.permalink = ':title/';

function locals() {
hexo.locals.invalidate();
return hexo.locals.toObject();
}

before(() => hexo.init());

it('default layout', async () => {
const post = await Post.insert({
source: 'foo',
slug: 'bar'
});
const data = await generator(locals());
post.__post = true;

data.should.eql([
{
