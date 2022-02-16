'use strict';

var cheerio = require('cheerio');
var should = require('chai').should();

describe('img', function(){
var img = require('../../../lib/plugins/tag/img');

it('src', function(){
var $ = cheerio.load(img(['http://placekitten.com/200/300']));
