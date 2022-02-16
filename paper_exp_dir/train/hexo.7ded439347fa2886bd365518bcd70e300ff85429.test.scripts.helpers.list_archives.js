'use strict';

require('chai').should();

describe('list_archives', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');

const ctx = {
config: hexo.config,
