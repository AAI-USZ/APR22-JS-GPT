'use strict';

describe('Excerpt', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const excerpt = require('../../../lib/plugins/filter/after_post_render/excerpt').bind(hexo);

it('without <!-- more -->', () => {
const content = [
'foo',
'bar',
'baz'
].join('\n');

const data = {
content
};

excerpt(data);
data.content.should.eql(content);
data.excerpt.should.eql('');
data.more.should.eql(content);
});

it('with <!-- more -->', () => {
const _moreCases = [
'<!-- more -->',
'<!-- more-->',
'<!--more -->',
'<!--more-->'
];

_moreCases.forEach(moreCase => _test(moreCase));

function _test(more) {
