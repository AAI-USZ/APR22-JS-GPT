'use strict';

const { join } = require('path');

describe('PostAsset', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const PostAsset = hexo.model('PostAsset');
const Post = hexo.model('Post');
let post;
const defaults = require('../../../lib/hexo/default_config');

before(async () => {
