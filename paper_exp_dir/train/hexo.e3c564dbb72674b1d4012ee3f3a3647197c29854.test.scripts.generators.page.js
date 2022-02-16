'use strict';

const Promise = require('bluebird');

describe('page', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname, {silent: true});
const Page = hexo.model('Page');
const generator = Promise.method(require('../../../lib/plugins/generator/page').bind(hexo));

function locals() {
hexo.locals.invalidate();
