var cheerio = require('cheerio');
var should = require('chai').should();

describe('vimeo', () => {
var vimeo = require('../../../lib/plugins/tag/vimeo');

it('id', () => {
var $ = cheerio.load(vimeo(['foo']));

$('.video-container').html().should.be.ok;
