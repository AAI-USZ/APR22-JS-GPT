'use strict';

require('chai').should();
const Promise = require('bluebird');

describe('list_tags', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');
const Tag = hexo.model('Tag');
