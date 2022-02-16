'use strict';

const sinon = require('sinon');
const Promise = require('bluebird');
const { full_url_for } = require('hexo-util');

describe('Category', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Category = hexo.model('Category');
const Post = hexo.model('Post');
const PostCategory = hexo.model('PostCategory');

before(() => hexo.init());
