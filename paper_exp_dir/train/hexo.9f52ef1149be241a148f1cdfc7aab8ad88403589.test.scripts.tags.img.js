'use strict';

const pathFn = require('path');
const cheerio = require('cheerio');

describe('img', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'img_test'));
const img = require('../../../lib/plugins/tag/img')(hexo);

before(() => hexo.init());

it('src', () => {
const $ = cheerio.load(img(['http://placekitten.com/200/300']));
