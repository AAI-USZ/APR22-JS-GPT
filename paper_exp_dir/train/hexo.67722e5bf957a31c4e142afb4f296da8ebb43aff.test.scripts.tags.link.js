var cheerio = require('cheerio');
var should = require('chai').should();

describe('link', () => {
var link = require('../../../lib/plugins/tag/link');

it('text + url', () => {
var $ = cheerio.load(link('Click here to Google http://google.com'.split(' ')));

$('a').attr('href').should.eql('http://google.com');
