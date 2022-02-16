'use strict';

describe('list_categories', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');
const Category = hexo.model('Category');

const ctx = {
config: hexo.config
};

