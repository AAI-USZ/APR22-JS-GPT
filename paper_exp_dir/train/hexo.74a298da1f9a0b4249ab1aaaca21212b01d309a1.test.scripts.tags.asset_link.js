'use strict';

var should = require('chai').should();
var Promise = require('bluebird');

describe('asset_link', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var assetLinkTag = require('../../../lib/plugins/tag/asset_link')(hexo);
var Post = hexo.model('Post');
var PostAsset = hexo.model('PostAsset');
var post;

