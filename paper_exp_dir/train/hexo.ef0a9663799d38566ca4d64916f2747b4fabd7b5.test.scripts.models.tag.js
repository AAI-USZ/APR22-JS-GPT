'use strict';

const sinon = require('sinon');
const Promise = require('bluebird');
const { full_url_for } = require('hexo-util');

describe('Tag', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Tag = hexo.model('Tag');
const Post = hexo.model('Post');
const PostTag = hexo.model('PostTag');

before(() => hexo.init());
