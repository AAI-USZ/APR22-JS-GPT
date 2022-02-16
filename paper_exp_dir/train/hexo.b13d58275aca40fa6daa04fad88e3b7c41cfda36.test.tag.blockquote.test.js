var cheerio = require('cheerio'),
should = require('chai').should();

describe('Tag - blockquote', function(){
var blockquote = require('../../lib/plugins/tag/blockquote');

var raw = '123456 **bold** and *italic*';

it('content', function(){
var $ = cheerio.load(blockquote([], raw));
