'use strict';

const should = require('chai').should();

describe('post_path', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const postPath = require('../../../lib/plugins/tag/post_path')(hexo);
const Post = hexo.model('Post');

hexo.config.permalink = ':title/';

