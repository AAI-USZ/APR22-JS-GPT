var should = require('chai').should();
var sinon = require('sinon');
var pathFn = require('path');
var Promise = require('bluebird');

describe('Post', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Post = hexo.model('Post');
var Tag = hexo.model('Tag');
var Category = hexo.model('Category');
var PostTag = hexo.model('PostTag');
var PostCategory = hexo.model('PostCategory');
var Asset = hexo.model('Asset');

before(() => {
hexo.config.permalink = ':title';
return hexo.init();
});

it('default values', () => {
var now = Date.now();

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
var errorCallback = sinon.spy(err => {
err.should.have.property('message', '`source` is required!');
});

return Post.insert({}).catch(errorCallback).finally(() => {
errorCallback.calledOnce.should.be.true;
});
});

it('slug - required', () => {
var errorCallback = sinon.spy(err => {
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

