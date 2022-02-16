'use strict';

const cheerio = require('cheerio');

describe('iframe', () => {
const iframe = require('../../../lib/plugins/tag/iframe');

it('url', () => {
const $ = cheerio.load(iframe(['http://zespia.tw']));

$('iframe').attr('src').should.eql('http://zespia.tw');
$('iframe').attr('width').should.eql('100%');
$('iframe').attr('height').should.eql('300');
$('iframe').attr('frameborder').should.eql('0');
