'use strict';

require('chai').should();

describe('pullquote', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const pullquote = require('../../../lib/plugins/tag/pullquote')(hexo);

before(() => hexo.init().then(() => hexo.loadPlugin(require.resolve('hexo-renderer-marked'))));

it('default', () => {
