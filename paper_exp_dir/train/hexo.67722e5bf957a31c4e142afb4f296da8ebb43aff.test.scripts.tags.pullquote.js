var should = require('chai').should();

describe('pullquote', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var pullquote = require('../../../lib/plugins/tag/pullquote')(hexo);

before(() => hexo.init().then(() => hexo.loadPlugin(require.resolve('hexo-renderer-marked'))));

it('default', () => {
var result = pullquote([], '123456 **bold** and *italic*');
result.should.eql('<blockquote class="pullquote"><p>123456 <strong>bold</strong> and <em>italic</em></p>\n</blockquote>');
