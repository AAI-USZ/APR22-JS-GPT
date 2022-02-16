'use strict';

var cheerio = require('cheerio');
var should = require('chai').should();

describe('iframe', function(){
var iframe = require('../../../lib/plugins/tag/iframe');

it('url', function(){
var $ = cheerio.load(iframe(['http://zespia.tw']));
