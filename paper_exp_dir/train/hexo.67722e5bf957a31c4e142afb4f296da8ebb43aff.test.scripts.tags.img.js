var pathFn = require('path');
var cheerio = require('cheerio');
var should = require('chai').should();

describe('img', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'img_test'));
var img = require('../../../lib/plugins/tag/img')(hexo);

before(() => hexo.init());
