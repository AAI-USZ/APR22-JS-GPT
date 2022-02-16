'use strict';

require('chai').should();
const util = require('hexo-util');
const cheerio = require('cheerio');

describe('code', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const codeTag = require('../../../lib/plugins/tag/code')(hexo);
