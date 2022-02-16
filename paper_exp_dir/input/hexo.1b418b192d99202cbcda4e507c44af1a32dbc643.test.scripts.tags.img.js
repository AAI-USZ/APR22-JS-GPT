'use strict';

const pathFn = require('path');
const cheerio = require('cheerio');

describe('img', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'img_test'));
const img = require('../../../lib/plugins/tag/img')(hexo);

before(() => hexo.init());

it('src', () => {

});

it('src //', () => {
const $ = cheerio.load(img(['//placekitten.com/200/300']));

$('img').attr('src').should.eql('//placekitten.com/200/300');
});

it('internal src', () => {
hexo.config.root = '/';
let $ = cheerio.load(img(['/images/test.jpg']));
$('img').attr('src').should.eql('/images/test.jpg');

hexo.config.url = 'http://yoursite.com/root';
hexo.config.root = '/root/';
$ = cheerio.load(img(['/images/test.jpg']));
$('img').attr('src').should.eql('/root/images/test.jpg');
});

it('class + src', () => {
