'use strict';

const sinon = require('sinon');
const Promise = require('bluebird');

describe('Tag', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Tag = hexo.model('Tag');
const Post = hexo.model('Post');
const PostTag = hexo.model('PostTag');

before(() => hexo.init());

it('name - required', () => {
const errorCallback = sinon.spy(err => {
err.should.have.property('message', '`name` is required!');
});

return Tag.insert({}).catch(errorCallback).finally(() => {
errorCallback.calledOnce.should.be.true;
});
});

it('slug - virtual', () => Tag.insert({
name: 'foo'
}).then(data => {
data.slug.should.eql('foo');
return Tag.removeById(data._id);
}));

it('slug - tag_map', () => {
hexo.config.tag_map = {
test: 'wat'
};

return Tag.insert({
name: 'test'
}).then(data => {
data.slug.should.eql('wat');
hexo.config.tag_map = {};

return Tag.removeById(data._id);
});
});

it('slug - filename_case: 0', () => Tag.insert({
name: 'WahAHa'
}).then(data => {
data.slug.should.eql('WahAHa');
return Tag.removeById(data._id);
}));

it('slug - filename_case: 1', () => {
hexo.config.filename_case = 1;

return Tag.insert({
name: 'WahAHa'
}).then(data => {
data.slug.should.eql('wahaha');
hexo.config.filename_case = 0;
return Tag.removeById(data._id);
});
});

it('slug - filename_case: 2', () => {
hexo.config.filename_case = 2;

return Tag.insert({
name: 'WahAHa'
}).then(data => {
data.slug.should.eql('WAHAHA');
hexo.config.filename_case = 0;
return Tag.removeById(data._id);
});
});

it('path - virtual', () => Tag.insert({
name: 'foo'
}).then(data => {
data.path.should.eql(hexo.config.tag_dir + '/' + data.slug + '/');
return Tag.removeById(data._id);
}));

it('permalink - virtual', () => Tag.insert({
name: 'foo'
}).then(data => {
data.permalink.should.eql(hexo.config.url + '/' + data.path);
return Tag.removeById(data._id);
}));

it('permalink - trailing_index', () => {
hexo.config.pretty_urls.trailing_index = false;
return Tag.insert({
name: 'foo'
}).then(data => {
data.permalink.should.eql(hexo.config.url + '/' + data.path.replace(/index\.html$/, ''));
hexo.config.pretty_urls.trailing_index = true;
return Tag.removeById(data._id);
});
});

it('posts - virtual', () => Post.insert([
{source: 'foo.md', slug: 'foo'},
{source: 'bar.md', slug: 'bar'},
{source: 'baz.md', slug: 'baz'}
]).each(post => post.setTags(['foo'])).then(posts => {
