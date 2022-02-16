describe('Tags', function(){
describe('blockquote', function(){
var blockquote = require('../lib/plugins/tag/blockquote');

it('content', function(){
blockquote([], '123456**bold**').should.be.eql('<blockquote><p>123456<strong>bold</strong></p>\n</blockquote>');
});

it('author', function(){
blockquote('John Doe'.split(' '), '123456**bold**').should.be.eql('<blockquote><p>123456<strong>bold</strong></p>\n<footer><strong>John Doe</strong></footer></blockquote>');
});

it('author + source', function(){
blockquote('John Doe, A book'.split(' '), '123456**bold**').should.be.eql('<blockquote><p>123456<strong>bold</strong></p>\n<footer><strong>John Doe</strong><cite>a Book</cite></footer></blockquote>');
});

it('author + link', function(){
blockquote('John Doe http://zespia.tw'.split(' '), '123456**bold**').should.be.eql('<blockquote><p>123456<strong>bold</strong></p>\n<footer><strong>John Doe</strong><cite><a href="http://zespia.tw">zespia.tw/</a></cite></footer></blockquote>');
blockquote('John Doe http://zespia.tw/this/is/a/fucking/long/url'.split(' '), '123456**bold**').should.be.eql('<blockquote><p>123456<strong>bold</strong></p>\n<footer><strong>John Doe</strong><cite><a href="http://zespia.tw/this/is/a/fucking/long/url">zespia.tw/this/is/a/fucking/&hellip;</a></cite></footer></blockquote>');
});

it('author + link + title', function(){
blockquote('John Doe http://zespia.tw My Blog'.split(' '), '123456**bold**').should.be.eql('<blockquote><p>123456<strong>bold</strong></p>\n<footer><strong>John Doe</strong><cite><a href="http://zespia.tw">My Blog</a></cite></footer></blockquote>');
});
});

describe('code', function(){
var code = require('../lib/plugins/tag/code');

it('content', function(){
code([], '').should.be.eql('<figure class="highlight"><pre>\n</pre></figure>');
});

it('lang', function(){
code('lang:js'.split(' '), '').should.be.eql('<figure class="highlight lang-js"><pre>\n</pre></figure>');
});
});

describe('gist', function(){
