'use strict';

describe('Meta Generator', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const metaGenerator = require('../../../lib/plugins/filter/meta_generator').bind(hexo);
const cheerio = require('cheerio');

it('default', () => {
const content = '<head><link></head>';
const result = metaGenerator(content);

