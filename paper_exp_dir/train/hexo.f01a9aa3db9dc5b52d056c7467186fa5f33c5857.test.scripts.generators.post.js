'use strict';

var should = require('chai').should();
var Promise = require('bluebird');
var _ = require('lodash');

describe('post', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname, {silent: true});
var Post = hexo.model('Post');
var generator = Promise.method(require('../../../lib/plugins/generator/post').bind(hexo));

hexo.config.permalink = ':title/';

function locals() {
hexo.locals.invalidate();
return hexo.locals.toObject();
}

before(function() {
return hexo.init();
});

it('default layout', function() {
return Post.insert({
source: 'foo',
slug: 'bar'
}).then(function(post) {
return generator(locals()).then(function(data) {
data.should.eql([
{
path: 'bar/',
layout: ['post', 'page', 'index'],
data: _.extend({__post: true}, post)
}
]);

return post.remove();
});
});
});

it('custom layout', function() {
return Post.insert({
source: 'foo',
slug: 'bar',
layout: 'photo'
}).then(function(post) {
return generator(locals()).then(function(data) {
data[0].layout.should.eql(['photo', 'post', 'page', 'index']);

return post.remove();
});
});
});

it('layout disabled', function() {
