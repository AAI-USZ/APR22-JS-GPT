'use strict';

var should = require('chai').should();

describe('asset_img', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var assetImgTag = require('../../../lib/plugins/tag/asset_img')(hexo);
var Post = hexo.model('Post');
var PostAsset = hexo.model('PostAsset');
var post;
