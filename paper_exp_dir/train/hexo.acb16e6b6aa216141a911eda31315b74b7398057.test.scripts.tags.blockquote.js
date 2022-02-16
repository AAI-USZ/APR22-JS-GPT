const should = require('chai').should();

describe('blockquote', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const blockquote = require('../../../lib/plugins/tag/blockquote')(hexo);

before(() => hexo.init().then(() => hexo.loadPlugin(require.resolve('hexo-renderer-marked'))));

const bq = (args, content) => blockquote(args.split(' '), content || '');

it('default', () => {
const result = bq('', '123456 **bold** and *italic*');
result.should.eql('<blockquote><p>123456 <strong>bold</strong> and <em>italic</em></p>\n</blockquote>');
});

it('author', () => {
const result = bq('John Doe', '');
result.should.eql('<blockquote><footer><strong>John Doe</strong></footer></blockquote>');
});

it('source', () => {
const result = bq('Jane Austen, Pride and Prejudice');
result.should.eql('<blockquote><footer><strong>Jane Austen</strong><cite>Pride and Prejudice</cite></footer></blockquote>');
});

it('link', () => {
const result = bq('John Doe http://hexo.io/');
result.should.eql('<blockquote><footer><strong>John Doe</strong><cite><a href="http://hexo.io/">hexo.io</a></cite></footer></blockquote>');
});

it('link title', () => {
const result = bq('John Doe http://hexo.io/ Hexo');
