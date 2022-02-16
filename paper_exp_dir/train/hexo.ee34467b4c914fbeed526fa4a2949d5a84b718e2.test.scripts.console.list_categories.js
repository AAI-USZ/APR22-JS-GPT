'use strict';

const Promise = require('bluebird');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('Console list', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');

const listCategories = require('../../../lib/plugins/console/list/category').bind(hexo);

let stub;

before(() => { stub = sinon.stub(console, 'log'); });

afterEach(() => { stub.reset(); });

after(() => { stub.restore(); });

it('no categories', () => {
listCategories();
