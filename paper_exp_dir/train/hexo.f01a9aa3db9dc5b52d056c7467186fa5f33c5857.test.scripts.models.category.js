'use strict';

var should = require('chai').should();
var sinon = require('sinon');
var Promise = require('bluebird');

describe('Category', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Category = hexo.model('Category');
var Post = hexo.model('Post');
var PostCategory = hexo.model('PostCategory');

before(function() {
return hexo.init();
});

it('name - required', function() {
var errorCallback = sinon.spy(function(err) {
err.should.have.property('message', '`name` is required!');
});

return Category.insert({}).catch(errorCallback).finally(function() {
errorCallback.calledOnce.should.be.true;
});
});

it.skip('parent - reference');

it('slug - virtual', function() {
return Category.insert({
name: 'foo'
}).then(function(data) {
data.slug.should.eql('foo');
return Category.removeById(data._id);
});
});

it('slug - category_map', function() {
hexo.config.category_map = {
test: 'wat'
};

return Category.insert({
name: 'test'
}).then(function(data) {
data.slug.should.eql('wat');
hexo.config.category_map = {};
return Category.removeById(data._id);
});
});

it('slug - filename_case: 0', function() {
return Category.insert({
name: 'WahAHa'
}).then(function(data) {
data.slug.should.eql('WahAHa');
return Category.removeById(data._id);
});
});

it('slug - filename_case: 1', function() {
