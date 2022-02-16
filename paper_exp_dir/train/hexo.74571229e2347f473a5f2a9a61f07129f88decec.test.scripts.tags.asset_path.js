'use strict';

var should = require('chai').should();

describe('asset_path', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var assetPathTag = require('../../../lib/plugins/tag/asset_path')(hexo);
var Post = hexo.model('Post');
var PostAsset = hexo.model('PostAsset');
var post;
