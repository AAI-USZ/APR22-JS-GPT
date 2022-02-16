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
