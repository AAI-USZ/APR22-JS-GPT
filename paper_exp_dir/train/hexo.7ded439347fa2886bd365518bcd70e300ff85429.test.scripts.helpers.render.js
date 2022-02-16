'use strict';

require('chai').should();

describe('render', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const render = require('../../../lib/plugins/helper/render')(hexo);

before(() => hexo.init());

it('default', () => {
