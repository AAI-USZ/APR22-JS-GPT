'use strict';

const cheerio = require('cheerio');

describe('link', () => {
const link = require('../../../lib/plugins/tag/link');

it('text + url', () => {
const $ = cheerio.load(link('Click here to Google https://google.com'.split(' ')));

$('a').attr('href').should.eql('https://google.com');
$('a').html().should.eql('Click here to Google');
});

it('text + url + external', () => {
let $ = cheerio.load(link('Click here to Google https://google.com true'.split(' ')));

$('a').attr('href').should.eql('https://google.com');
$('a').html().should.eql('Click here to Google');
$('a').attr('target').should.eql('_blank');

$ = cheerio.load(link('Click here to Google https://google.com false'.split(' ')));

$('a').attr('href').should.eql('https://google.com');
$('a').html().should.eql('Click here to Google');
should.not.exist($('a').attr('target'));
});

it('text + url + title', () => {
const $ = cheerio.load(link('Click here to Google https://google.com Google link'.split(' ')));

$('a').attr('href').should.eql('https://google.com');
$('a').html().should.eql('Click here to Google');
$('a').attr('title').should.eql('Google link');
});

it('text + url + external + title', () => {
let $ = cheerio.load(link('Click here to Google https://google.com true Google link'.split(' ')));

$('a').attr('href').should.eql('https://google.com');
