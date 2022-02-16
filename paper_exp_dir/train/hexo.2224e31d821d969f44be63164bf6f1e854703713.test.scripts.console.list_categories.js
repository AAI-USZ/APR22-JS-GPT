'use strict';

const Promise = require('bluebird');
const { stub, assert: sinonAssert } = require('sinon');

describe('Console list', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');

const listCategories = require('../../../lib/plugins/console/list/category').bind(hexo);

let logStub;
