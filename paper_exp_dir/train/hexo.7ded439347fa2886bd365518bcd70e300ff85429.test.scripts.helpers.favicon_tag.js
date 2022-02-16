'use strict';

require('chai').should();

describe('favicon_tag', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);

const ctx = {
config: hexo.config
};
