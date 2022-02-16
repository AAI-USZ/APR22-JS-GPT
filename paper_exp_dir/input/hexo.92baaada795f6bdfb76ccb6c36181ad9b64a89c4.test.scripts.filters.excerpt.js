var should = require('chai').should();

describe('Excerpt', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var excerpt = require('../../../lib/plugins/filter/after_post_render/excerpt').bind(hexo);

it('without <!-- more -->', () => {
var content = [
'foo',
'bar',
'baz'
].join('\n');

var data = {
content
};

excerpt(data);
data.content.should.eql(content);
data.excerpt.should.eql('');
data.more.should.eql(content);
});

it('with <!-- more -->', () => {

_moreCases().forEach(_test);

function _moreCases() {
var template = '<!--{{lead}}more{{tail}}-->';

var spaces = ' \f\n\r\t\v\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\ufeff';
var cases = [];
