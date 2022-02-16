'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;

describe('Console list', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Page = hexo.model('Page');
const listPages = require('../../../lib/plugins/console/list/page').bind(hexo);

hexo.config.permalink = ':title/';

let stub;

before(() => { stub = sinon.stub(console, 'log'); });

afterEach(() => { stub.reset(); });

after(() => { stub.restore(); });

it('no page', () => {
listPages();
