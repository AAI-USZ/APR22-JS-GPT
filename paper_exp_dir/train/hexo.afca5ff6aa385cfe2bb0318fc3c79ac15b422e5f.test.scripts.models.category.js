'use strict';

const sinon = require('sinon');
const Promise = require('bluebird');

describe('Category', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Category = hexo.model('Category');
const Post = hexo.model('Post');
const PostCategory = hexo.model('PostCategory');

before(() => hexo.init());

it('name - required', () => {
const errorCallback = sinon.spy(err => {
err.should.have.property('message', '`name` is required!');
});

return Category.insert({}).catch(errorCallback).finally(() => {
errorCallback.calledOnce.should.be.true;
});
});

it.skip('parent - reference');

it('slug - virtual', () => Category.insert({
name: 'foo'
}).then(data => {
data.slug.should.eql('foo');
return Category.removeById(data._id);
}));

it('slug - category_map', () => {
hexo.config.category_map = {
test: 'wat'
};

return Category.insert({
name: 'test'
}).then(data => {
data.slug.should.eql('wat');
hexo.config.category_map = {};
return Category.removeById(data._id);
});
});

it('slug - filename_case: 0', () => Category.insert({
name: 'WahAHa'
}).then(data => {
data.slug.should.eql('WahAHa');
return Category.removeById(data._id);
}));

it('slug - filename_case: 1', () => {
hexo.config.filename_case = 1;

return Category.insert({
name: 'WahAHa'
}).then(data => {
data.slug.should.eql('wahaha');
hexo.config.filename_case = 0;
return Category.removeById(data._id);
});
});

it('slug - filename_case: 2', () => {
hexo.config.filename_case = 2;

return Category.insert({
name: 'WahAHa'
}).then(data => {
data.slug.should.eql('WAHAHA');
hexo.config.filename_case = 0;
return Category.removeById(data._id);
});
});

it('slug - parent', () => Category.insert({
name: 'parent'
}).then(cat => Category.insert({
name: 'child',
parent: cat._id
})).then(cat => {
cat.slug.should.eql('parent/child');

return Promise.all([
Category.removeById(cat._id),
Category.removeById(cat.parent)
]);
}));

it('path - virtual', () => Category.insert({
name: 'foo'
}).then(data => {
data.path.should.eql(hexo.config.category_dir + '/' + data.slug + '/');
return Category.removeById(data._id);
}));

it('permalink - virtual', () => Category.insert({
name: 'foo'
}).then(data => {
data.permalink.should.eql(hexo.config.url + '/' + data.path);
return Category.removeById(data._id);
}));

it('permalink - trailing_index', () => {
hexo.config.pretty_urls.trailing_index = false;
return Category.insert({
name: 'foo'
}).then(data => {
data.permalink.should.eql(hexo.config.url + '/' + data.path.replace(/index\.html$/, ''));
hexo.config.pretty_urls.trailing_index = true;
return Category.removeById(data._id);
});
});

it('permalink - should be encoded', () => {
hexo.config.url = 'http://fôo.com';
return Category.insert({
name: 'bár'
}).then(data => {
data.permalink.should.eql('http://xn--fo-8ja.com/' + data.path);
return Category.removeById(data._id);
});
});

