'use strict';

const { stub, assert: sinonAssert } = require('sinon');

describe('Console list', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');

const listPosts = require('../../../lib/plugins/console/list/post').bind(hexo);

let logStub;
