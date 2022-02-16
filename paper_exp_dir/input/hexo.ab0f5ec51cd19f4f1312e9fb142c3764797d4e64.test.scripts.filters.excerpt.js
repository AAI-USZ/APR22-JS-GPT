'use strict';

var should = require('chai').should();

describe('Excerpt', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var excerpt = require('../../../lib/plugins/filter/after_post_render/excerpt').bind(hexo);

it('without <!-- more -->', function() {
var content = [
'foo',
'bar',
'baz'
].join('\n');

var data = {
content: content
};

excerpt(data);
data.content.should.eql(content);
data.excerpt.should.eql('');
data.more.should.eql(content);
});

it('with <!-- more -->', function() {
