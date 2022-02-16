'use strict';

var cheerio = require('cheerio');
var should = require('chai').should();

describe('gist', () => {
var gist = require('../../../lib/plugins/tag/gist');

it('id', () => {
var $ = cheerio.load(gist(['foo']));
