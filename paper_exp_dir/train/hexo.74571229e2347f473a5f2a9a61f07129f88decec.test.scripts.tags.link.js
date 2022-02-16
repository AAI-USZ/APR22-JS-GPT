'use strict';

var cheerio = require('cheerio');
var should = require('chai').should();

describe('link', function(){
var link = require('../../../lib/plugins/tag/link');

it('text + url', function(){
var $ = cheerio.load(link('Click here to Google http://google.com'.split(' ')));
