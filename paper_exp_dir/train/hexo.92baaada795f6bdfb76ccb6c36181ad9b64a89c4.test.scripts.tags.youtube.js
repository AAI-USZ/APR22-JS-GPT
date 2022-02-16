'use strict';

var cheerio = require('cheerio');
var should = require('chai').should();

describe('youtube', () => {
var youtube = require('../../../lib/plugins/tag/youtube');

it('id', () => {
var $ = cheerio.load(youtube(['foo']));
