'use strict';

const cheerio = require('cheerio');

describe('jsfiddle', () => {
const jsfiddle = require('../../../lib/plugins/tag/jsfiddle');

it('id', () => {
const $ = cheerio.load(jsfiddle(['foo']));

$('iframe').attr('src').should.eql('//jsfiddle.net/foo/embedded/js,resources,html,css,result/light');
});

