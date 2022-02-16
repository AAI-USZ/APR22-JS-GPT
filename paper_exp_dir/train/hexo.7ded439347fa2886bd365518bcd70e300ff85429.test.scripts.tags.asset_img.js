'use strict';

const should = require('chai').should();
const Promise = require('bluebird');

describe('asset_img', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const assetImgTag = require('../../../lib/plugins/tag/asset_img')(hexo);
const Post = hexo.model('Post');
