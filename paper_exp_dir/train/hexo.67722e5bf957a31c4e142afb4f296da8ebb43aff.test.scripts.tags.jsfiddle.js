var cheerio = require('cheerio');
var should = require('chai').should();

describe('jsfiddle', () => {
var jsfiddle = require('../../../lib/plugins/tag/jsfiddle');

it('id', () => {
var $ = cheerio.load(jsfiddle(['foo']));

$('iframe').attr('src').should.eql('//jsfiddle.net/foo/embedded/js,resources,html,css,result/light');
