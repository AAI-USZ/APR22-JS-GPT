'use strict';

const decache = require('decache');

describe('Meta Generator', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
let metaGenerator;
const cheerio = require('cheerio');

beforeEach(() => {
decache('../../../lib/plugins/filter/after_render/meta_generator');
