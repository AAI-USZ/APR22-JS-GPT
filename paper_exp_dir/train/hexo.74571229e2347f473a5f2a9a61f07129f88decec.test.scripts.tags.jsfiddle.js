'use strict';

var cheerio = require('cheerio');
var should = require('chai').should();

describe('jsfiddle', function(){
var jsfiddle = require('../../../lib/plugins/tag/jsfiddle');

it('id', function(){
var $ = cheerio.load(jsfiddle(['foo']));
