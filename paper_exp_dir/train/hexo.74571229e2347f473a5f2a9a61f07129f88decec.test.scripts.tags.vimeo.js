'use strict';

var cheerio = require('cheerio');
var should = require('chai').should();

describe('vimeo', function(){
var vimeo = require('../../../lib/plugins/tag/vimeo');

it('id', function(){
var $ = cheerio.load(vimeo(['foo']));
