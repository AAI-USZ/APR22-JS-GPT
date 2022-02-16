var cheerio = require('cheerio');
var should = require('chai').should();

describe('iframe', () => {
var iframe = require('../../../lib/plugins/tag/iframe');

it('url', () => {
var $ = cheerio.load(iframe(['http://zespia.tw']));

$('iframe').attr('src').should.eql('http://zespia.tw');
