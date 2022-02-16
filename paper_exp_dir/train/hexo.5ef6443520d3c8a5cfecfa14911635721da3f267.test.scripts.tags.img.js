'use strict';

var pathFn = require('path');
var cheerio = require('cheerio');
var should = require('chai').should();

describe('img', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'img_test'));
var img = require('../../../lib/plugins/tag/img')(hexo);

before(function() {
return hexo.init();
});

it('src', function() {
var $ = cheerio.load(img(['http://placekitten.com/200/300']));

$('img').attr('src').should.eql('http://placekitten.com/200/300');
});

it('internal src', function() {
hexo.config.root = '/';
var $ = cheerio.load(img(['/images/test.jpg']));
$('img').attr('src').should.eql('/images/test.jpg');

hexo.config.url = 'http://yoursite.com/root';
hexo.config.root = '/root/';
$ = cheerio.load(img(['/images/test.jpg']));
$('img').attr('src').should.eql('/root/images/test.jpg');
});

it('class + src', function() {
var $ = cheerio.load(img('left http://placekitten.com/200/300'.split(' ')));

$('img').attr('src').should.eql('http://placekitten.com/200/300');
