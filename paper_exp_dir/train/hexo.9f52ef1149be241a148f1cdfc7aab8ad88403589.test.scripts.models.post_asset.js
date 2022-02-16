'use strict';

const sinon = require('sinon');
const pathFn = require('path');

describe('PostAsset', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const PostAsset = hexo.model('PostAsset');
const Post = hexo.model('Post');
let post;

