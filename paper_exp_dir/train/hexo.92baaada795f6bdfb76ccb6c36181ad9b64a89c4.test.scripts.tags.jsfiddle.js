'use strict';

var cheerio = require('cheerio');
var should = require('chai').should();

describe('jsfiddle', () => {
var jsfiddle = require('../../../lib/plugins/tag/jsfiddle');

it('id', () => {
var $ = cheerio.load(jsfiddle(['foo']));
