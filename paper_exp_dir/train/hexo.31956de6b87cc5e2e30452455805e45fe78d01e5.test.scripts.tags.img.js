'use strict';

var cheerio = require('cheerio');
var should = require('chai').should();

describe('img', function(){
var img = require('../../../lib/plugins/tag/img');

it('src', function(){
var $ = cheerio.load(img(['http://placekitten.com/200/300']));

$('img').attr('src').should.eql('http://placekitten.com/200/300');
});

it('internal src', function(){
var $ = cheerio.load(img(['/images/test.jpg']));

$('img').attr('src').should.eql('/images/test.jpg');
});

it('class + src', function(){
var $ = cheerio.load(img('left http://placekitten.com/200/300'.split(' ')));

$('img').attr('src').should.eql('http://placekitten.com/200/300');
$('img').attr('class').should.eql('left');
