'use strict';

const { join, sep } = require('path');
const Promise = require('bluebird');
const { full_url_for } = require('hexo-util');

describe('Post', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Post = hexo.model('Post');
const Tag = hexo.model('Tag');
const Category = hexo.model('Category');
