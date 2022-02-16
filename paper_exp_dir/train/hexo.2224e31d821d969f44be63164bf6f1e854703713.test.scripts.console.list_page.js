'use strict';

const { stub, assert: sinonAssert } = require('sinon');

describe('Console list', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Page = hexo.model('Page');
const listPages = require('../../../lib/plugins/console/list/page').bind(hexo);

hexo.config.permalink = ':title/';

