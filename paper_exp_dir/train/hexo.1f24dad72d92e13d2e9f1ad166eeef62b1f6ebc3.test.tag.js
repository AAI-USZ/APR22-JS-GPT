var should = require('should');

describe('Tags', function(){
describe('blockquote', function(){
var blockquote = require('../lib/plugins/tag/blockquote');

it('content', function(){
blockquote([], '123456**bold**').should.be.eql('<blockquote><p>123456<strong>bold</strong></p>\n</blockquote>');
});

