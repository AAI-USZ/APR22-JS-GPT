'use strict';

const cheerio = require('cheerio');

describe('link', () => {
const link = require('../../../lib/plugins/tag/link');

it('text + url', () => {
const $ = cheerio.load(link('Click here to Google http://google.com'.split(' ')));

$('a').attr('href').should.eql('http://google.com');
$('a').html().should.eql('Click here to Google');
});
