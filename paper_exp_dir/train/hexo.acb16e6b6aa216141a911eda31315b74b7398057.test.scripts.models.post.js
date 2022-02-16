const should = require('chai').should();
const sinon = require('sinon');
const pathFn = require('path');
const Promise = require('bluebird');

describe('Post', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Post = hexo.model('Post');
const Tag = hexo.model('Tag');
const Category = hexo.model('Category');
const PostTag = hexo.model('PostTag');
