'use strict';

const Promise = require('bluebird');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('Console list', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');

const listCategories = require('../../../lib/plugins/console/list/category').bind(hexo);

before(() => {
const log = console.log;
sinon.stub(console, 'log').callsFake((...args) => {
return log.apply(log, args);
});
});

after(() => {
console.log.restore();
});

it('no categories', () => {
listCategories();
