'use strict';

require('chai').should();
const fixture = require('../../fixtures/post_render');

describe('Render post', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Post = hexo.model('Post');
const Page = hexo.model('Page');
