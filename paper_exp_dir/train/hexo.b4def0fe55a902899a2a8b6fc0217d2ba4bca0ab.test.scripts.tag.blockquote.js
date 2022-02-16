var cheerio = require('cheerio'),
should = require('chai').should();

describe('Tag - blockquote', function(){
var blockquote = require('../../../lib/plugins/tag/blockquote');

var bq = function(args){
var result = blockquote(args.split(' '), '123456 **bold** and *italic*');

return result.replace(/<escape>(.*?)<\/escape>/g, '$1');
};

it('author', function(){
var $ = cheerio.load(bq('John Doe'));

$('blockquote footer strong').html().should.eql('John Doe');
