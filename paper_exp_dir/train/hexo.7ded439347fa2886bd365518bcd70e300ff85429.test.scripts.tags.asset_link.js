'use strict';

const should = require('chai').should();
const Promise = require('bluebird');

describe('asset_link', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const assetLinkTag = require('../../../lib/plugins/tag/asset_link')(hexo);
const Post = hexo.model('Post');
