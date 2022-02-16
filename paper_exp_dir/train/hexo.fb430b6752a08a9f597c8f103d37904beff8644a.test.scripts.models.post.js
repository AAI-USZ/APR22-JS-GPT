'use strict';

const sinon = require('sinon');
const pathFn = require('path');
const Promise = require('bluebird');

describe('Post', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Post = hexo.model('Post');
const Tag = hexo.model('Tag');
const Category = hexo.model('Category');
const PostTag = hexo.model('PostTag');
const PostCategory = hexo.model('PostCategory');
const Asset = hexo.model('Asset');

before(() => {
hexo.config.permalink = ':title';
return hexo.init();
});

it('default values', () => {
const now = Date.now();

return Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(data => {
data.title.should.eql('');
data.date.valueOf().should.gte(now);
data.updated.valueOf().should.gte(now);
data.comments.should.be.true;
data.layout.should.eql('post');
data._content.should.eql('');
data.link.should.eql('');
data.raw.should.eql('');
data.published.should.be.true;
should.not.exist(data.content);
should.not.exist(data.excerpt);
should.not.exist(data.more);

return Post.removeById(data._id);
});
});

it('source - required', () => {
const errorCallback = sinon.spy(err => {
err.should.have.property('message', '`source` is required!');
});

return Post.insert({}).catch(errorCallback).finally(() => {
errorCallback.calledOnce.should.be.true;
});
});

it('slug - required', () => {
const errorCallback = sinon.spy(err => {
err.should.have.property('message', '`slug` is required!');
});

return Post.insert({
source: 'foo.md'
}).catch(errorCallback).finally(() => {
errorCallback.calledOnce.should.be.true;
});
});

it('path - virtual', () => Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(data => {
data.path.should.eql(data.slug);
return Post.removeById(data._id);
}));

it('permalink - virtual', () => {
hexo.config.root = '/';
return Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(data => {
data.permalink.should.eql(hexo.config.url + '/' + data.path);
return Post.removeById(data._id);
});
});

it('permalink - should be encoded', () => {
hexo.config.url = 'http://fôo.com';
return Post.insert({
source: 'foo.md',
slug: 'bár'
}).then(data => {
data.permalink.should.eql('http://xn--fo-8ja.com/b%C3%A1r');
hexo.config.url = 'http://yoursite.com';
return Post.removeById(data._id);
});
});

it('permalink - virtual - when set relative_link', () => {
hexo.config.root = '/';
hexo.config.relative_link = true;
return Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(data => {
data.permalink.should.eql(hexo.config.url + '/' + data.path);
hexo.config.relative_link = false;
return Post.removeById(data._id);
});
});

it('permalink_root_prefix - virtual', () => {
hexo.config.url = 'http://yoursite.com/root';
hexo.config.root = '/root/';
return Post.insert({
source: 'foo.md',
slug: 'bar'
