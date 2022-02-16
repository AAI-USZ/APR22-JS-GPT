'use strict';

const Promise = require('bluebird');

describe('asset_path', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const assetPathTag = require('../../../lib/plugins/tag/asset_path')(hexo);
const Post = hexo.model('Post');
const PostAsset = hexo.model('PostAsset');
let post;

